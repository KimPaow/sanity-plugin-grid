import { randomKey as RandomKey } from "./randomKey";
import { resolveJSType } from "./resolveJSType";

export function createProtoValue(type) {
  if (type.jsonType !== "object") {
    throw new Error(
      `Invalid item type: "${type.type}". Default array input can only contain objects (for now)`
    );
  }
  const key = RandomKey(12);
  console.debug(
    "[createProtoValue] onCreateValue: ",
    type.name === "object"
      ? { _key: key }
      : {
          _type: type.name,
          _key: key
        }
  );
  return type.name === "object"
    ? { _key: key }
    : {
        _type: type.name,
        _key: key
      };
}

export function resolveTypeName(value) {
  const jsType = resolveJSType(value);
  return (jsType === "object" && "_type" in value && value._type) || jsType;
}

export const getMemberType = (value, type) => {
  const itemTypeName = resolveTypeName(value);
  return type.of.find(memberType => memberType.name === itemTypeName);
};

export const randomKey = RandomKey;
