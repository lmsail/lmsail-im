import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import messageSound from '../../assets/audio/message.mp3'

/**
 * 新消息音效提醒
 */
class MessageSound extends Component {

    componentDidMount() {
        PubSub.subscribe('playMessageSound', (msg, data) => {
            this.audioSource.load()
            this.audioSource.play()
        })
    }

    render() {
        return (
            <audio ref={audio => { this.audioSource = audio }}>
                <source src={ messageSound } /> 
            </audio>
        )
    }
}

export default MessageSound