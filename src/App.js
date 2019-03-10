import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import LazyLoad from "react-lazyload";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import BrightnessTwoOutlined from "@material-ui/icons/Brightness2Outlined";
import WbSunny from "@material-ui/icons/WbSunny";
import CloseIcon from "@material-ui/icons/Close";
import isMobile from "ismobilejs";
import InfiniteScroll from "react-infinite-scroller";

class App extends Component {
  state = {
    loading: false,
    open: false,
    dialogOpen: false,
    targetIndex: null,
    images: [],
    hasMore: true,
    badConnection: false,
    nightMode: false,
    focusIndex: 0
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
    this.setState({ dialogOpen: false, badConnection: true });
  };

  render() {
    const imageItems = this.state.images.map((image, index) => (
      <LazyLoad
        // placeholder={"あああ"}
        key={image.id.toString()}
        height={200}
        offset={400}
        once
      >
        <img
          tabIndex={0}
          // onFocus={() =>
          //   this.setState({
          //     focusIndex: index
          //   })
          // }
          alt={image.title}
          style={{
            objectFit: "cover",
            width: `${isMobile.any ? "31%" : "18%"}`,
            height: `${isMobile.any ? "100px" : "150px"}`,
            margin: "0 1% 6px 1%"
          }}
          onClick={() => {
            this.setState({
              open: true,
              targetIndex: index
            });
          }}
          onKeyPress={target => {
            if (target.charCode == 13) {
              this.setState({
                open: true,
                targetIndex: index
              });
            }
          }}
          // onKeyDown={target => {
          //   console.log(target.keyCode, target.ctrlKey);
          //   if (isMobile.any) return;
          //   if (
          //     target.keyCode === 39 ||
          //     (target.ctrlKey && target.keyCode === 70)
          //   ) {
          //     tabIndex + 1 < images.length &&
          //       this.setState({
          //         tabIndex: this.state.tabIndex + 1
          //       });
          //   }
          //   if (
          //     target.keyCode === 37 ||
          //     (target.ctrlKey && target.keyCode === 66)
          //   ) {
          //     tabIndex > 0 &&
          //       this.setState({
          //         tabIndex: this.state.tabIndex - 1
          //       });
          //   }
          //   if (
          //     target.keyCode === 40 ||
          //     (target.ctrlKey && target.keyCode === 78)
          //   ) {
          //     tabIndex + 5 < images.length &&
          //       this.setState({
          //         tabIndex: this.state.tabIndex + 5
          //       });
          //   }
          //   if (
          //     target.keyCode === 38 ||
          //     (target.ctrlKey && target.keyCode === 80)
          //   ) {
          //     tabIndex > 4 &&
          //       this.setState({
          //         tabIndex: this.state.tabIndex - 5
          //       });
          //   }
          // }}
          src={image.url}
        />
      </LazyLoad>
    ));

    const {
      targetIndex,
      open,
      dialogOpen,
      hasMore,
      badConnection,
      nightMode,
      images
    } = this.state;

    return (
      <div
        className="App"
        style={
          nightMode
            ? { margin: "0 auto", backgroundColor: "#10171E" }
            : { margin: "0 auto" }
        }
      >
        <AppBar
          position="sticky"
          color="default"
          style={nightMode ? { backgroundColor: "#1c2938" } : null}
        >
          <Toolbar>
            <Typography
              style={
                nightMode
                  ? { flexGrow: 1, color: "#8899a6" }
                  : { flexGrow: 1, color: "#2d8c3c" }
              }
              variant="h6"
              color="primary"
            >
              Photos
            </Typography>
            <IconButton
              style={nightMode ? { color: "#8899a6" } : { color: "#2d8c3c" }}
              onClick={() => this.setState({ nightMode: !nightMode })}
              color="primary"
              aria-label="Change to Night Mode"
            >
              {nightMode ? <WbSunny /> : <BrightnessTwoOutlined />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <InfiniteScroll
          initialLoad
          loadMore={() => this.getImage()}
          hasMore={hasMore}
        >
          {imageItems}
        </InfiniteScroll>
        <Modal
          aria-labelledby={open ? images[targetIndex].title : ""}
          aria-describedby={open ? images[targetIndex].description : ""}
          open={open}
          onClose={this.handleClose.bind(this)}
        >
          <div
            style={{
              margin: `${isMobile.any ? "200px 5%" : "50px 10%"}`
            }}
            onKeyDown={target => {
              console.log(target.keyCode, target.ctrlKey);
              if (isMobile.any) return;
              if (
                target.keyCode === 39 ||
                (target.ctrlKey && target.keyCode === 70)
              ) {
                targetIndex + 1 < images.length &&
                  this.setState({
                    targetIndex: this.state.targetIndex + 1
                  });
              }
              if (
                target.keyCode === 37 ||
                (target.ctrlKey && target.keyCode === 66)
              ) {
                targetIndex > 0 &&
                  this.setState({
                    targetIndex: this.state.targetIndex - 1
                  });
              }
              if (
                target.keyCode === 40 ||
                (target.ctrlKey && target.keyCode === 78)
              ) {
                targetIndex + 5 < images.length &&
                  this.setState({
                    targetIndex: this.state.targetIndex + 5
                  });
              }
              if (
                target.keyCode === 38 ||
                (target.ctrlKey && target.keyCode === 80)
              ) {
                targetIndex > 4 &&
                  this.setState({
                    targetIndex: this.state.targetIndex - 5
                  });
              }
            }}
          >
            {targetIndex !== null && (
              <img
                alt={images[targetIndex].title}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  maxHeight: "500px",
                  borderStyle: "none",
                  backgroundColor: "black"
                }}
                src={images[targetIndex].url}
              />
            )}
          </div>
        </Modal>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={dialogOpen}
          autoHideDuration={6000}
          onClose={this.handleDialogClose}
          ContentProps={{
            "aria-describedby": "サーバーエラーが発生しました。"
          }}
          message={
            badConnection ? (
              <span id="接続の良いところで再接続してください">
                接続が良くないです。接続の良いところで再接続してください
              </span>
            ) : (
              <span id="リロードしても良いですか">
                サーバーエラーが発生しました。リロードしてもよろしいですか？
              </span>
            )
          }
          action={[
            <Button
              key="ok"
              color="secondary"
              size="small"
              onClick={() => {
                this.handleDialogClose();
                this.getImage();
              }}
            >
              OK!
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleDialogClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
        {/* <Dialog
          open={dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="サーバーエラー"
          aria-describedby="エラーが発生しました"
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
        </Dialog> */}
      </div>
    );
  }
}

export default App;
