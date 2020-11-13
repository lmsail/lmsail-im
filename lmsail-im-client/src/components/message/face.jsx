import React, { Component } from 'react'

const emjoy = '😄 😊 😃 😉 😍 😘 😚 😳 😁 😌 😜 😝 😒 😏 😓 😔 😖 😥 😰 😨 😣 😢 😭 😂 😱 😠 😪 😷 😇 😋 😧 😦 😯 😵 😛 😶 😎 😅 😟 👍 👎 👏 🙏 ✊ ❗ 🔞 🚳 📵 🆙 🐲 🎉 🔥 🌹 💔 🌱 💣 💥 🎲 💰 🔔 🔕 💩 🐮 🍺 💎 👀';
const emjoyList = emjoy.split(" ");

class FaceEmjoy extends Component {
    render() {
        const { showFace } = this.props
        return <section className="face-emjoy" style={{ display: showFace ? 'block' : 'none' }}>
            <div className="face-container">{ emjoyList.map(item => <span className="emjoy" onClick={e => this.sendFace(e, item)} key={item}>{ item }</span>) }</div>
        </section>
    }

    sendFace = (e, emjoy) => {
        e.nativeEvent.stopImmediatePropagation()
        this.props.parent.getFaceItem(this, emjoy)
    }
}
export default FaceEmjoy