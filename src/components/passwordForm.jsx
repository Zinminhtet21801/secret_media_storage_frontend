import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export default function PasswordForm({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  errorMessage,
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormControl id={id} isRequired>
      <FormLabel>{label}</FormLabel>
      <InputGroup borderColor={error ? "#fc8181" : "inherit"}>
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <InputRightElement h={"full"}>
          <Button
            variant={"ghost"}
            onClick={() => setShowPassword((showPassword) => !showPassword)}
          >
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
      {error && (
        <Text textAlign={"start"} color={error && "#fc8181"}>
          {errorMessage}
        </Text>
      )}
    </FormControl>
  );
}
