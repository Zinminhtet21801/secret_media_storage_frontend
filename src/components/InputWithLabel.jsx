import { Box, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";

export default function InputWithLabel({
  id,
  isRequired,
  label,
  type,
  onChange,
  onBlur,
  error,
  errorMessage,
  value,
}) {
  return (
    <Box>
      <FormControl id={id} isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Input
          type={type}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          borderColor={error ? "#fc8181" : "inherit"}
        />
        {error && (
          <Text textAlign={"start"} color={error && "#fc8181"}>
            {errorMessage}
          </Text>
        )}
      </FormControl>
    </Box>
  );
}
