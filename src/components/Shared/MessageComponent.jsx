import { Box, Typography } from '@mui/material'
import React,{memo} from 'react'
import { LightBlue } from '../../constants/Color'
import moment from 'moment'
import {fileFormat} from '../../lib/Features'
import RenderContent from './RenderContent'

const MessageComponent = ({message, user}) => {
    const {sender, content ,attachments,createdAt}=message
    const sameSender=sender?._id===user.data._id
    console.log(sender?._id ,"userID",user.data._id)
    const timeAgo=moment(createdAt).fromNow()
  return (
    <div
        style={{
            alignSelf:sameSender? "flex-end"  : "flex-start",
            backgroundColor:"white",
            color:"black",
            borderRadius:"5px",
            padding:"0.5rem",
            width:"fit-content"

        }}
    
    >

        {!sameSender && <Typography color={LightBlue} fontWeight={"600"} variant='caption'>{sender.name}</Typography>}
        {
            content && <Typography>{content}</Typography>
        }
        {attachments?.length>0 && 
        (
            attachments.map((attachment,index)=>{
                const url=attachment.url;
                const file=fileFormat(url);

                return <Box key={index}>
                   
                    <a href={url} target='' download={true} style={{color:"black"}}>
                        {RenderContent(file,url)}
                    </a>
                </Box>
            })
        )
        }
        <Typography variant='caption' color={"text.secondary"}>{timeAgo}</Typography>
    </div>
  )
}

export default memo(MessageComponent)