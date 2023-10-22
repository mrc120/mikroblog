import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from "@chakra-ui/react"
import { Wrapper } from "../components/Wrapper"
import { InputField } from "../components/InputField";
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/ToErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Wrapper>
            <Formik
                initialValues={{ email: "", username: '', password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values)
                    const response = await register({ options: values });
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
                                name="email"
                                label="email"
                                placeholder="email"
                            />
                        </Box>
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
export default withUrqlClient(createUrqlClient)(Register)