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
import Help from "@material-ui/icons/Help";
import HelpOutlined from "@material-ui/icons/HelpOutlined";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import isMobile from "ismobilejs";
import InfiniteScroll from "react-infinite-scroller";

// 一覧画面で矢印移動を実現しようとしたが、時間的に間に合わず断念。
//
// class ImageItem extends Component {
//   constructor(props) {
//     super(props);
//     this.imgFocus = React.createRef();
//   }
//   componentDidMount() {
//     if (this.props.focusIndex === this.props.index) {
//       this.imgFocus.current.focus();
//     }
//   }

//   render() {
//     const { image, showDetail } = this.props;
//     return (
//       <img
//         ref={this.imgFocus}
//         tabIndex={0}
//         // onFocus={() =>
//         //   this.setState({
//         //     focusIndex: index
//         //   })
//         // }
//         alt={image.title}
//         style={{
//           objectFit: "cover",
//           width: `${isMobile.any ? "31%" : "18%"}`,
//           height: `${isMobile.any ? "100px" : "150px"}`,
//           margin: "0 1% 6px 1%"
//         }}
//         onClick={() => {
//           showDetail();
//         }}
//         onKeyPress={target => {
//           if (target.charCode == 13) {
//             showDetail();
//           }
//         }}
//         // onKeyDown={target => {
//         //   console.log(target.keyCode, target.ctrlKey);
//         //   if (isMobile.any) return;
//         //   if (
//         //     target.keyCode === 39 ||
//         //     (target.ctrlKey && target.keyCode === 70)
//         //   ) {
//         //     tabIndex + 1 < images.length &&
//         //       this.setState({
//         //         tabIndex: this.state.tabIndex + 1
//         //       });
//         //   }
//         //   if (
//         //     target.keyCode === 37 ||
//         //     (target.ctrlKey && target.keyCode === 66)
//         //   ) {
//         //     tabIndex > 0 &&
//         //       this.setState({
//         //         tabIndex: this.state.tabIndex - 1
//         //       });
//         //   }
//         //   if (
//         //     target.keyCode === 40 ||
//         //     (target.ctrlKey && target.keyCode === 78)
//         //   ) {
//         //     tabIndex + 5 < images.length &&
//         //       this.setState({
//         //         tabIndex: this.state.tabIndex + 5
//         //       });
//         //   }
//         //   if (
//         //     target.keyCode === 38 ||
//         //     (target.ctrlKey && target.keyCode === 80)
//         //   ) {
//         //     tabIndex > 4 &&
//         //       this.setState({
//         //         tabIndex: this.state.tabIndex - 5
//         //       });
//         //   }
//         // }}
//         src={image.url}
//       />
//     );
//   }
// }

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
    focusIndex: 0,
    helpOpen: false
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

  handleHelpClose = () => {
    this.setState({ helpOpen: false });
  };

  render() {
    const imageItems = this.state.images.map((image, index) => (
      <LazyLoad key={image.id.toString()} height={200} offset={400} once>
        <img
          tabIndex={0}
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
              aria-label="すごい写真集"
            >
              すごい写真集
            </Typography>
            <IconButton
              style={nightMode ? { color: "#8899a6" } : { color: "#2d8c3c" }}
              onClick={() => this.setState({ nightMode: !nightMode })}
              color="primary"
              aria-label="ダークモード切り替え"
            >
              {nightMode ? <WbSunny /> : <BrightnessTwoOutlined />}
            </IconButton>
            <IconButton
              style={nightMode ? { color: "#8899a6" } : { color: "#2d8c3c" }}
              onClick={() => this.setState({ helpOpen: true })}
              color="primary"
              aria-label="ヘルプボタン"
            >
              {nightMode ? <Help /> : <HelpOutlined />}
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
              aria-label="ok"
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
        <Dialog
          open={this.state.helpOpen}
          onClose={this.handleHelpClose}
          aria-labelledby="help"
          aria-describedby="help-wanted"
        >
          <DialogTitle id="help-title">{"なにかお困りですか？"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="help-content">
              一覧、詳細画像ではそれぞれ次のショートカットが有効です。お試しください。
            </DialogContentText>
            <div style={{ textAlign: "left", marginTop: 20 }}>
              <DialogContentText id="help-content">tab = 次</DialogContentText>
              <DialogContentText id="help-content">
                enter = 詳細表示
              </DialogContentText>
            </div>
            <div style={{ textAlign: "left", marginTop: 20 }}>
              <DialogContentText id="help-content">
                ctrl + f, → = 次
              </DialogContentText>
              <DialogContentText id="help-content">
                ctrl + b, ← = 前
              </DialogContentText>
              <DialogContentText id="help-content">
                ctrl + n, ↓ = 次の段
              </DialogContentText>
              <DialogContentText id="help-content">
                ctrl + p, ↑ = 前の段
              </DialogContentText>
              <DialogContentText id="help-content">
                esc = 一覧
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleHelpClose}
              color="primary"
              style={{ color: "#2d8c3c" }}
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
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
