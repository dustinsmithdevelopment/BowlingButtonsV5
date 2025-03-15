import {AudioGizmo, CodeBlockEvent, Component, Player, PropTypes} from "horizon/core";
import {Binding, Pressable, Text, UIComponent, UINode, View} from "horizon/ui";

const START_EVENT_NAME = "startGame";
const RESET_EVENT_NAME = "resetGame";
const BALL_GLITCH_EVENT_NAME = "ballGlitch";
const JOIN_EVENT_NAME = "joinGame";
const SKIP_PLAYER_EVENT_NAME = "skipTurn";

const BACKGROUND_COLOR = "#230e2d";
const BUTTON_BORDER_COLOR = "#70128d";
const BUTTON_BORDER_RADIUS = 20;
const BUTTON_SPACING = 20;
const START_SEPARATION = 100;





const startEvent = new CodeBlockEvent<[player: Player]>(START_EVENT_NAME, [PropTypes.Player]);
const resetEvent = new CodeBlockEvent<[player: Player]>(RESET_EVENT_NAME, [PropTypes.Player]);
const ballGlitchEvent = new CodeBlockEvent<[player: Player]>(BALL_GLITCH_EVENT_NAME, [PropTypes.Player]);
const joinEvent = new CodeBlockEvent<[player: Player]>(JOIN_EVENT_NAME, [PropTypes.Player]);
const skipPlayerEvent = new CodeBlockEvent<[player: Player]>(SKIP_PLAYER_EVENT_NAME, [PropTypes.Player]);


const buttonStyling = {width: 100, height: 100};

const startButtonColor = new Binding("green");
const resetButtonColor = new Binding("red");
const ballGlitchButtonColor = new Binding("yellow");
const joinGameButtonColor = new Binding("blue");
const skipPlayerButtonColor = new Binding("purple");

function BorderBox(button: UINode, borderRadius: number|undefined = undefined): UINode{
  if (borderRadius === undefined){
    return View({
      children: [button], style: {padding: 5, backgroundColor: BUTTON_BORDER_COLOR, margin: 20},
    })
  }
  else {
    return View({
      children: [button], style: {padding: 5, backgroundColor: BUTTON_BORDER_COLOR, borderRadius: borderRadius}
    })
  }

}

class BowlingButtons extends UIComponent<typeof BowlingButtons> {
  panelHeight = 300;
  panelWidth = 600;
  static propsDefinition = {
    manager: {type: PropTypes.Entity},
    SFX: {type: PropTypes.Entity},
  };
  private soundGizmo: AudioGizmo | undefined;
  initializeUI(): UINode {
    return View({
      children: [
        View({children: [
            View({style: {height: "25%"}}),
            BorderBox(Pressable({onClick: (player) => {
                this.handleButtonPress(player, startEvent, startButtonColor);
              } ,children: [
                Text({text: "Start",
                  style: {color: "white", height: '100%', textAlignVertical: 'center', textAlign: 'center'}})]
              , style: {backgroundColor: startButtonColor, ...buttonStyling}})),
          ]}),
        View({style: {width: START_SEPARATION}}),
        View({children: [
            View({style: {height: BUTTON_SPACING}}),
            BorderBox(Pressable({onClick: (player) => {
                this.handleButtonPress(player, resetEvent, resetButtonColor);
              } ,children: [
                Text({text: "Reset",
                  style: {color: "white", height: '100%', textAlignVertical: 'center', textAlign: 'center'}})],
              style: {backgroundColor: resetButtonColor, ...buttonStyling, borderRadius: BUTTON_BORDER_RADIUS}}), BUTTON_BORDER_RADIUS),
            View({style: {height: BUTTON_SPACING}}),
            BorderBox(Pressable({onClick: (player) => {
                this.handleButtonPress(player, ballGlitchEvent, ballGlitchButtonColor);
              } ,children: [
                Text({text: "Ball Glitched",
                  style: {color: "black", height: '100%', textAlignVertical: 'center', textAlign: 'center'}})],
              style: {backgroundColor: ballGlitchButtonColor, ...buttonStyling, borderRadius: BUTTON_BORDER_RADIUS}}),BUTTON_BORDER_RADIUS),
            View({style: {height: BUTTON_SPACING}})],
          style:{display:"flex",flexDirection:"column",justifyContent:"center"}}),
        View({style: {width: BUTTON_SPACING}}),
        View({children: [
            View({style: {height: BUTTON_SPACING}}),
            BorderBox(Pressable({onClick: (player) => {
                this.handleButtonPress(player, joinEvent, joinGameButtonColor);
              } ,children: [
                Text({text: "Join",
                  style: {color: "white", height: '100%', textAlignVertical: 'center', textAlign: 'center'}})],
              style: {backgroundColor: joinGameButtonColor, ...buttonStyling, borderRadius: BUTTON_BORDER_RADIUS}}),BUTTON_BORDER_RADIUS),
            View({style: {height: BUTTON_SPACING}}),
            BorderBox(Pressable({onClick: (player) => {
                this.handleButtonPress(player, skipPlayerEvent, skipPlayerButtonColor);
              } ,children: [
                Text({text: "Skip Turn",
                  style: {height: '100%', textAlignVertical: 'center', textAlign: 'center'}})],
              style: {backgroundColor: skipPlayerButtonColor, ...buttonStyling, borderRadius: BUTTON_BORDER_RADIUS}}),BUTTON_BORDER_RADIUS),
            View({style: {height: BUTTON_SPACING}})],
          style:{display:"flex",flexDirection:"column",justifyContent:"center"}}),
        View({style: {width: BUTTON_SPACING}})
      ], style: {backgroundColor: BACKGROUND_COLOR, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}
    })
  }

  start() {
    if (this.props.SFX){
      this.soundGizmo = this.props.SFX.as(AudioGizmo);
    }
  }
  private handleButtonPress(player: Player, event: CodeBlockEvent<[player: Player]>, buttonBinding: Binding<string>) {
    this.sendCodeBlockEvent(this.props.manager!, event, player);
    buttonBinding.set("white", [player]);
    this.soundGizmo?.play();
    this.async.setTimeout(()=>{buttonBinding.reset([player])},150);
  }
}
Component.register(BowlingButtons);