import React, { useState } from 'react';
import { NextPage } from 'next';
import { Wrapper } from '../../components/Wrapper';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import router from 'next/router';
import { InputField } from '../../components/InputField';
import { toErrorMap } from '../../utils/ToErrorMap';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [, changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState('')
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors);
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap)
                    } else if (response.data?.changePassword.user) {
                        router.push("/")
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            label="newPassword"
                            placeholder="newPassword"
                        />
                        {tokenError ? <Box color="red">{tokenError}</Box> : null}
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            color="red">
                            Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}


export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword)