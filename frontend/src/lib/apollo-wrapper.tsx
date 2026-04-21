"use client";

import { ApolloProvider } from "@apollo/client/react";
import { client } from "./apollo-client";

interface ApolloWrapperProps {
  children: React.ReactNode;
}

export const ApolloWrapper: React.FC<ApolloWrapperProps> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
