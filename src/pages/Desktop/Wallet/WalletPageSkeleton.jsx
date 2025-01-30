import React from 'react';
import { Box, Paper, Skeleton } from "@mui/material";

const WalletPageSkeleton = () => {
  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5" }} className="max-h-fit overflow-hidden sm:max-h-[calc(100vh-90px)]">
      <Box sx={{
        maxWidth: "1200px",
        mx: "auto",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
      }}>
        {/* Left Section */}
        <Paper sx={{ width: { xs: "100%", md: "350px" }, p: 3, borderRadius: 2 }}>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}>
            <Skeleton variant="circular" width={120} height={120} sx={{ mb: 2 }} />
            <Skeleton variant="text" width={128} height={32} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton variant="rounded" width="100%" height={40} />
            <Skeleton variant="rounded" width="100%" height={40} />
          </Box>
        </Paper>

        {/* Right Section */}
        <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[...Array(6)].map((_, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2 }}>
                <Skeleton variant="rounded" width={80} height={40} />
                <Skeleton variant="rounded" width="40%" height={40} />
                <Skeleton variant="rounded" width={120} height={40} />
                <Skeleton variant="rounded" width={80} height={40} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default WalletPageSkeleton;