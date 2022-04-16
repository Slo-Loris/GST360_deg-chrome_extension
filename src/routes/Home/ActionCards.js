import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import DownloadJsonIcon from "@mui/icons-material/IntegrationInstructionsTwoTone";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";

const ActionCards = () => {
  return (
    <>
      <Card
        sx={{
          maxWidth: "200px",
          mb: "8px",
          mt: "8px",
        }}
      >
        <CardActionArea>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DownloadJsonIcon sx={{ fontSize: 50, color: "success.main" }} />
            <Typography
              variant="body1"
              textAlign="center"
              sx={{ fontWeight: "Bold" }}
            >
              DOWNLOAD JSON
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ fontWeight: "Regular" }}
            >
              Download returns in Json format and convert it into excel with our
              tool
            </Typography>
          </CardContent>
        </CardActionArea>
        {/* <CardActions
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {options.map((option, index) => {
            return (
              <Button key={index} size="medium" variant="text">
                {option}
              </Button>
            );
          })}
        </CardActions> */}
      </Card>
    </>
  );
};

export default ActionCards;
