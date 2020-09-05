import * as React from 'react';

  
const TimerSimple = (props: ITimerSimple) => {

    const [seconds, setSeconds] = React.useState(props.seconds);
    const [minutes, setMinutes] = React.useState(props.minutes);
    const [isActive, setIsActive] = React.useState(props.timerEnabled);
    const [showMessage, setShowMessage] = React.useState(false);

    function toggle() {
        setIsActive(true);
    }

    function showCompleteMsg(enabled: boolean){
        setShowMessage(true);
        return (
            <div>Time's Up!</div>
        )
    }

    function showSeconds():string{
        if (seconds >= 10){
            return `${seconds}`;
        } else {
            return `0${seconds}`;
        }
    }
    function showMinutes():string{
        if (minutes >= 10){
            return `${minutes}`;
        } else {
            return `0${minutes}`;
        }
    }

    React.useEffect(() => {
        let interval: any = null;
        if (isActive && seconds > 0) {
          interval = setInterval(() => {
            setSeconds(seconds => seconds - 1);
          }, 1000);
        } else if (!isActive && seconds !== 0) {
          clearInterval(interval);
        } else if (seconds === 0 && minutes > 0){
            setMinutes(minutes => minutes - 1);
            setSeconds(seconds => 60);
              
        } else if (seconds === 0 && minutes === 0){
            showCompleteMsg(true);
        }
        return () => clearInterval(interval);
      }, [isActive, seconds, minutes]);
    
    
    
    return (
        <div className="App">
            <div className="time">
                {showMinutes()}:
                {showSeconds()} 
                <span>
                    {showMessage ? " Done!": ""}
                </span>
            </div>
            <div className="row">
                <button className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
                    {'Start'}
                </button>
            </div>
        </div>
        
    );
}
export interface ITimerSimple {
    timerEnabled: boolean
    seconds: number
    minutes: number
}


export default TimerSimple;