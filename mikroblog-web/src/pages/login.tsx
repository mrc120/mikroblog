import React from 'react'
import { Formik, Form } from 'formik'
import { Flex, Link, Box, Button } from "@chakra-ui/react"
import { Wrapper } from "../components/Wrapper"
import { InputField } from "../components/InputField";
import { useLoginMutation } from '../generated/graphql';
import { withUrqlClient } from "next-urql";
import { toErrorMap } from '../utils/ToErrorMap';
import { useRouter } from 'next/router';
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'

const Login: React.FC<{}> = ({ }) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        router.push("/")
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="usernameOrEmail"
                            label="Podaj nazwę użytkownika lub hasło"
                            placeholder="Podaj nazwę użytkownika lub hasło"
                        />
                        <Box mt={5}>
                            <InputField
                                name="password"
                                label="password"
                                placeholder="password"
                            />
                        </Box>
                        <Flex mt="2">
                            <NextLink href="/forgot-password">
                                <Link ml="auto">Przypomnij hasło</Link>
                            </NextLink>
                        </Flex>
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
export default withUrqlClient(createUrqlClient)(Login);
