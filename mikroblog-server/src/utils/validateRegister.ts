
import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";


export const validateRegister = (options: UsernamePasswordInput) => {

    if (!options.email.includes('@')) {
        return [
            {
              field: "email",
              message: "Wymagany jest prawidłowy adres e-mail",
            },
          ]
      }
      if (options.username.length <= 3) {
        return [
            {
              field: "password",
              message: "Musi mieć więcej niż 3 znaki",
            },
          ]
      }
      if (options.password.length <= 3) {
        return [
            {
              field: "password",
              message: "Musi mieć więcej niż 3 znaki",
            },
          ]
      }

     return null;
}