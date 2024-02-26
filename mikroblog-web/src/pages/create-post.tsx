import React from "react"
import { Wrapper } from '../components/Wrapper';
import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";

const CreatePost: React.FC<{}> = ({ }) => {
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();
    return (
        <Layout variant='small'>
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async (values) => {
                    const { error } = await createPost({ input: values })
                    console.log("error: ", error)
                    if (error) {
                        router.push("/")
                    }}
                }>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="title"
                            label="title"
                            placeholder="Tytuł" />
                        <Box mt={5}>
                            <InputField
                                textarea
                                name="text"
                                label="Body"
                                placeholder="Tekst" />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            variant="teal"> Dodaj Post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout >
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost);