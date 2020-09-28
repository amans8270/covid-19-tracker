import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({title,cases,total}) {
    return (
    <Card className="infoBox">
        <CardContent>
        <Typography   className="infobox_title" color="textSecondary" >
            {title}
        </Typography>
        <h1 className="info_cases">{cases}</h1>
        <Typography className="infobox_total" color="textSecondary">
            {total}Total
        </Typography>

        </CardContent>
    </Card>
        
        )
}

export default InfoBox
