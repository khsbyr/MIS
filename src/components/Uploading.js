import React from 'react';
import { Image } from 'antd';
import 'antd/dist/antd.css';
import { Input } from 'antd';
import '../index.scss';
class Uploading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null
    }
    this.handleChange = this.handleChange.bind(this)
  }
  
  handleChange(event) {
    if (!event.target?.files?.length)
      return
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }

  render() {
    return (
      <div className="upload-div" >
        <Image style={{ width: "auto", height: 300 }} src={this.state.file} />
        <Input style={{ display: "none" }} id="upload" type="file" onChange={this.handleChange}></Input>
        <div className="dot">
          <label htmlFor="upload">Файл сонгох</label>
        </div>
      </div>
    );
  }
}
export default Uploading