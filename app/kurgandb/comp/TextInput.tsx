
import { TextInput as MantineTextInput, TextInputProps } from "@mantine/core";

export default function TextInput(props: TextInputProps) {
  return <MantineTextInput
    classNames={{
      root: "relative pb-5",
      error: "absolute bottom-1 mb-0",
      wrapper: "mb-[5px]",
    }}
    {...props}
  />
}