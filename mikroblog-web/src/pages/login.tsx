import React from 'react'
import { Formik, Form } from 'formik'
import {Box, Button } from "@chakra-ui/react"
import { Wrapper } from "../components/Wrapper"
import { InputField } from "../components/InputField";
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/ToErrorMap';
import { useRouter } from 'next/router';



const Login: React.FC<{}> = ({ }) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper>
            <Formik
                initialValues={{ username: '', password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values)
                    const response = await login({options: values});
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
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
                            variant="teal"> Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}
export default Login