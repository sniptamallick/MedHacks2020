import * as React from 'react';

import db from '../model/Database';
import { Card as CardEntity, Topic as TopicEntity } from '../model/Database';

import EditableTitle from './EditableTitle';
import Cards from './Cards';
import CardEditor from './CardEditor';
import Button from './Button';
import ButtonLink from './ButtonLink';
import Dropdown, { DropdownItem } from './Dropdown';
import Empty from './Empty';

const Topic = (props: ITopicProps) => {
    const [cards, setCards] = React.useState<CardEntity[]>(db.cards.getByTopic(props.topic.id));
    const [showCardEditor, setShowCardEditor] = React.useState<boolean>(false);
    const [isDeleted, setIsDeleted] = React.useState<boolean>(false);

    React.useEffect(() => {
        setCards(db.cards.getByTopic(props.topic.id));
        setIsDeleted(false);
    }, [props.topic]);

    const toggleCardEditor = () => {
        setShowCardEditor(show => !show);
    }

    const onNameChange = (newName: string) => {
        if (newName === "" || newName === props.topic.name) return;
        props.topic.name = newName;
        props.onTopicChange();
    }

    const onDelete = () => {
        db.topics.delete(props.topic.id);
        cards.forEach(c => db.cards.delete(c.id));
        props.onTopicChange();
        setIsDeleted(true);
    }

    const updateCards = () => {
        setCards(db.cards.getByTopic(props.topic.id));
    }

    if (isDeleted) {
        return (
            <Empty icon="delete_forever" message="Topic has been deleted" />
        );
    }

    const hasCards = cards.length > 0;

    return (
        <div className={hasCards ? "col col-center" : "col col-center full-height"}>
            <EditableTitle title={props.topic.name} onSubmit={onNameChange} />


            <section className="row row-center col-center wrap space-fixed">
                
                {hasCards && <ButtonLink name="Start Task" icon="flag" to={`/review/${props.topic.id}`} />}
                
            </section>

            {showCardEditor && <CardEditor topicId={props.topic.id} onSave={updateCards} onCancel={toggleCardEditor} />}

            {hasCards}
            {showCardEditor || <Button name="Add Step" icon="add" action={toggleCardEditor} />}
            <Cards cards={cards} onCardChange={updateCards} />
            <Button name="Delete" icon="delete" action={onDelete} />
        </div>
    );
}

interface ITopicProps {
    topic: TopicEntity
    onTopicChange(): void
}

export default Topic;