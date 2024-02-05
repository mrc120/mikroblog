import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Box } from "@chakra-ui/react"
import { Wrapper } from "../components/Wrapper"
import { InputField } from "../components/InputField";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient"
import { useChangePasswordMutation, useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: React.FC<{}> = ({ }) => {
    const [complete, setComplete] = useState(false);
    const [, forgotPassword] = useForgotPasswordMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values) => {
                    await forgotPassword(values);
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) =>
                    complete ?
                        <Box>
                            Jeśli konto z tym adresem email istnieje to wyślemy Ci wiadomość na ten adres
                        </Box>
                        : (
                            <Form>
                                <InputField
                                    name="email"
                                    label="Email"
                                    placeholder="email"
                                    type="email"
                                />
                                <Button
                                    mt={4}
                                    type="submit"
                                    isLoading={isSubmitting}
                                    variant="solid"
                                    colorScheme='green'> Zapomniałem hasła
                                </Button>
                            </Form>
                        )}
            </Formik>
        </Wrapper >
    );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);