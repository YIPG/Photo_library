import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import LazyLoad from "react-lazyload";
import Modal from "@material-ui/core/Modal";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import isMobile from "ismobilejs";

class App extends Component {
  state = {
    offset: 0,
    imageID: [],
    imageURL: [],
    open: false,
    dialogOpen: false,
    targetURL: "//:0"
  };

  componentDidMount() {}

  getImage = async () => {
    try {
      const response = await axios.get(
        "https://wfc-2019.firebaseapp.com/images",
        {
          params: {
            limit: 10,
            offset: this.state.offset
          }
        }
      );
      this.setState({
        offset: this.state.offset + 10
      });
      // console.log(response.data.data.images);
      response.data.data.images.forEach(image => {
        // console.log(image);
        this.setState({
          imageURL: [...this.state.imageURL, image.url],
          imageID: [...this.state.imageID, image.id]
        });
      });
      console.log(`state内: `, this.state.imageURL);
    } catch (err) {
      console.log(`画像URLを取得する過程でエラーが発生しました: ${err}`);
      this.setState({
        dialogOpen: true
      });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const imageItems = this.state.imageURL.map(image => (
      <LazyLoad key={image.toString()} height={200}>
        <img
          alt=""
          style={{
            objectFit: "cover",
            width: `${isMobile.any ? "33%" : "20%"}`,
            height: `${isMobile.any ? "100px" : "150px"}`
          }}
          onClick={() => {
            this.setState({
              open: true,
              targetURL: image
            });
          }}
          src={image}
        />
      </LazyLoad>
    ));

    return (
      <div className="App" style={{ margin: "0 auto" }}>
        こんにちは
        <button onClick={() => this.getImage()}>画像URL取得</button>
        <div>{imageItems}</div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
        >
          <div
            style={{
              margin: "10%"
            }}
          >
            {this.state.targetURL !== "//:0" && (
              <img
                alt=""
                style={{ objectFit: "contain", width: "100%" }}
                src={this.state.targetURL}
              />
            )}
          </div>
        </Modal>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"サーバーエラーのようです。。。"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              もう一度ロードをしてよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              ダメ
            </Button>
            <Button
              onClick={() => {
                this.handleDialogClose();
                this.getImage();
              }}
              color="primary"
              autoFocus
            >
              OK!
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
