import { Box } from "@mui/material";
import Image from "next/image";

export default function Header() {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "center",
        borderBottom: 1,
        borderColor: "divider",
        p: 2,
      }}
    >
      <Image
        src="/logo.webp"
        alt="Property Genie"
        width={128}
        height={48}
        style={{
          width: "100%",
          maxWidth: 128,
          height: "auto",
          objectFit: "contain",
        }}
        loading="eager"
      />
    </Box>
  );
}
