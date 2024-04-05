import { ExtractSchema, ExtractSchemaType, TableExtractColumn } from "api";

export function Text(description: string): ExtractSchema.Text {
  return {
    type: "Text",
    description,
  };
}

export function Attribute(description: string): ExtractSchema.Attribute {
  return {
    type: "Attribute",
    description,
  };
}

export function Table(columns: TableExtractColumn[]): ExtractSchema.Table {
  return {
    type: "Table",
    columns,
  };
}

export function Column(
  name: string,
  description: string,
  type: typeof ExtractSchemaType.Text | typeof ExtractSchemaType.Attribute
): TableExtractColumn {
  return {
    name,
    schema: {
      type,
      description,
    },
  };
}
