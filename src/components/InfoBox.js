import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core";
import "./infoBox.css";
function InfoBox({title,cases,total,isRed,active,...props}) {
    return (
    <Card 
    onClick={props.onClick}
    className={`infoBox ${active && 'infoBox--selected'} ${isRed && "infoBox--red"}`}>
        <CardContent>
        <Typography   className="infobox_title" color="textSecondary" >
            {title}
        </Typography>
        <h1 className={`info_cases ${!isRed && "infoBox_cases--green"}`}>{cases}</h1>
        <Typography className="infobox_total" color="textSecondary">
            {total}Total
        </Typography>

        </CardContent>
    </Card>
        
        )
}

export default InfoBox
