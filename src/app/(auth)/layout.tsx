import { Container } from "@chakra-ui/react";
import AppToolBar from "../../components/blocks/AppToolBar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container fluid centerContent padding={0}>
      <AppToolBar />
      {children}
    </Container>
  );
}
