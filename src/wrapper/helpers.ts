import { ExtractSchema, TableExtractColumn, FormValue } from "api";

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
  schema: ExtractSchema.Attribute | ExtractSchema.Text
): TableExtractColumn {
  return {
    name,
    schema,
  };
}

export function FormValue(value: string, description: string): FormValue {
  return {
    value,
    description,
  };
}
