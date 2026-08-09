/**
 * Browser-safe YAML frontmatter parser (no Node Buffer / gray-matter).
 * Supports scalars, indented lists (`- item`), and nested maps.
 */

export type FrontmatterData = Record<string, unknown>;

type YamlValue = string | number | boolean | null | YamlValue[] | { [key: string]: YamlValue };

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseScalar(raw: string): YamlValue {
  const value = raw.trim();
  if (!value || value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value.startsWith('{') || value.startsWith('[')) {
    try {
      return JSON.parse(value) as YamlValue;
    } catch {
      // fall through
    }
  }
  return stripQuotes(value);
}

function nextMeaningfulLine(
  lines: string[],
  from: number
): { index: number; indent: number; text: string } | null {
  for (let i = from; i < lines.length; i += 1) {
    const raw = lines[i];
    if (!raw.trim() || raw.trimStart().startsWith('#')) continue;
    return {
      index: i,
      indent: raw.match(/^ */)?.[0].length ?? 0,
      text: raw.trim(),
    };
  }
  return null;
}

/**
 * Minimal indented YAML parser for Handbook frontmatter.
 */
export function parseSimpleYaml(source: string): FrontmatterData {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const root: Record<string, YamlValue> = {};
  const stack: Array<{ indent: number; container: Record<string, YamlValue> | YamlValue[] }> = [
    { indent: -1, container: root },
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) continue;

    const indent = rawLine.match(/^ */)?.[0].length ?? 0;
    const line = rawLine.trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const frame = stack[stack.length - 1];
    const container = frame.container;

    if (line.startsWith('- ')) {
      if (!Array.isArray(container)) {
        throw new Error(`YAML list item outside list: ${line}`);
      }
      container.push(parseScalar(line.slice(2)));
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1 || Array.isArray(container)) continue;

    const key = line.slice(0, colonIndex).trim();
    const valuePart = line.slice(colonIndex + 1).trim();

    if (valuePart) {
      container[key] = parseScalar(valuePart);
      continue;
    }

    const next = nextMeaningfulLine(lines, i + 1);
    if (next && next.indent > indent && next.text.startsWith('- ')) {
      const list: YamlValue[] = [];
      container[key] = list;
      stack.push({ indent, container: list });
    } else {
      const child: Record<string, YamlValue> = {};
      container[key] = child;
      stack.push({ indent, container: child });
    }
  }

  return root as FrontmatterData;
}

export function parseFrontmatter(raw: string): { data: FrontmatterData; content: string } {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) {
    return { data: {}, content: text };
  }

  const end = text.indexOf('\n---\n', 4);
  if (end === -1) {
    return { data: {}, content: text };
  }

  return {
    data: parseSimpleYaml(text.slice(4, end)),
    content: text.slice(end + 5),
  };
}
