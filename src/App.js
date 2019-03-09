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
import InfiniteScroll from "react-infinite-scroller";

class App extends Component {
  state = {
    loading: false,
    open: false,
    dialogOpen: false,
    targetURL: "//:0",
    images: [],
    hasMore: true
  };

  componentWillUnmount() {
    this.setState({
      hasMore: false
    });
  }

  getImage = async () => {
    if (this.state.loading) {
      console.log(`読み込み中`);
      return;
    }
    this.setState({
      loading: true
    });
    try {
      const response = await axios.get(
        "https://wfc-2019.firebaseapp.com/images",
        {
          params: {
            limit: 10,
            offset: this.state.images.length
          }
        }
      );
      console.log(response.data.data.images.length);
      if (response.data.data.images.length === 0) {
        this.setState({
          hasMore: false
        });
      }
      this.setState({
        images: [...this.state.images, ...response.data.data.images],
        loading: false
      });
      // response.data.data.images.forEach(image => {
      //   // console.log(image);
      //   this.setState({
      //     imageURL: [...this.state.imageURL, image.url],
      //     imageID: [...this.state.imageID, image.id]
      //   });
      // });
    } catch (err) {
      console.log(`画像URLを取得する過程でエラーが発生しました: ${err}`);
      this.setState({
        dialogOpen: true,
        loading: false
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
    const imageItems = this.state.images.map(image => (
      <LazyLoad
        // placeholder={"あああ"}
        key={image.id.toString()}
        height={200}
        offset={400}
        once
      >
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
              targetURL: image.url
            });
          }}
          src={image.url}
        />
      </LazyLoad>
    ));

    return (
      <div className="App" style={{ margin: "0 auto" }}>
        <InfiniteScroll
          initialLoad
          loadMore={() => this.getImage()}
          hasMore={this.state.hasMore}
        >
          {imageItems}
        </InfiniteScroll>
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
