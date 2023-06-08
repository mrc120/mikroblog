import React from 'react'
import { Formik, Form } from 'formik'
import { FormControl, FormLabel, FormErrorMessage, Input, Box, Button } from "@chakra-ui/react"
import { Wrapper } from "../components/Wrapper"
import { InputField } from "../components/InputField";
import { useMutation } from 'urql';
import { useRegisterMutation } from '../generated/graphql';
import { responsePathAsArray } from 'graphql';
import { toErrorMap } from '../utils/ToErrorMap';
import { useRouter } from 'next/router';

interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Wrapper>
            <Formik
                initialValues={{ username: '', password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values)
                    const response = await register(values);
                    [{ field: 'username', message: 'imerror' }]
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
                        router.push("/")
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            label="username"
                            placeholder="username"
                        />
                        <Box mt={5}>
                            <InputField
                                name="password"
                                label="password"
                                placeholder="password"
                            />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            variant="teal"> Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}
export default Register