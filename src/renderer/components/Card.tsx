import * as React from 'react';

import db from '../model/Database';
import { Card as CardEntity } from '../model/Database';

import CardView from './CardView';
import Dropdown, { DropdownItem } from './Dropdown';
import Modal from './Modal';
import CardEditor from './CardEditor';
import TimerSimple from './TimerSimple';
import Button from './Button';

import SimpleTTS = require("simpletts");

const Card = (props: ICardProps) => {
    const [showEditor, setShowEditor] = React.useState<boolean>(false);

    const toggleEditor = () => {
        setShowEditor(show => !show);
        if (props.onToggleModal !== undefined) props.onToggleModal();
    }

    const onDelete = () => {
        db.cards.delete(props.card.id);
        props.onDelete();
    }

    const playAudio = () =>
    {
        const tts = new SimpleTTS();
 
    tts.getVoices().then((voices: Array<Voice>) => {
 
    return tts.read({
        "text": props.card.front,
        "voice": voices[0]
    });
 
        }).then((options: Options) => {
            console.log(options);
        }).catch((err: Error) => {
            console.log(err);
        });

    }

    return (
        <>
            <CardView front={props.card.front} time={props.card.time}>
                <div className = "top-corner">
                    <Button name="" icon="volume_up" action={playAudio} />
                    </div>

                    <Dropdown name="" icon="more_horiz" className="card-dropdown" showDownArrow={false} >
                    <DropdownItem name="Edit" icon="edit" action={toggleEditor} />
                    <DropdownItem name="Delete" icon="delete" action={onDelete} />
                    </Dropdown>

                <div hidden={!(props.card.time && props.card.time > 0)}></div>

                <TimerSimple timerEnabled={false} minutes={props.card.time}></TimerSimple>
                {props.children || null}
            </CardView>

            <Modal show={showEditor} onClickOutside={toggleEditor}>
                <CardEditor
                    onSave={toggleEditor}
                    onCancel={toggleEditor}
                    card={props.card}
                />
            </Modal>
        </>
    );
}

interface ICardProps {
    card: CardEntity
    onDelete(): void
    onToggleModal?(): void
    children?: React.ReactNode
}

interface Voice {
    name: string;
    gender: "female" | "male";
}
 
interface Options {
    text: string;
    volume?: number;
    speed?: number;
    voice?: Voice | string;
}

export default Card;