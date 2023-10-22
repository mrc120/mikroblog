import React from "react";
import { Box, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { Button } from "@chakra-ui/react";

interface NavBarProps { }

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box ml={"auto"} mr={3} bg="tomato">{data.me.username}</Box>
        <Button
          onClick={()=>{
            // @ts-ignore
           logout();
          }}
          variant="link"
          isLoading={logoutFetching}
        >
          LogOut</Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato" p={3}>
      <Box ml={"auto"} bg="tomato">{body}</Box>
    </Flex>
  );
};
