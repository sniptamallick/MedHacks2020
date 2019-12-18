import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import db from '../model/Database';
import { Card as CardEntity } from '../model/Database';

import Card from './Card';
import Button from './Button';

export default class Review extends React.Component<IProps, IState> {
    private cards: CardEntity[];

    public constructor(props: IProps) {
        super(props);
        const topicId = Number(this.props.match.params.topicId);
        this.cards = Number.isNaN(topicId) ? db.cards.getDue() : db.cards.getDue(topicId);

        this.shuffle();

        this.state = {
            currentCard: this.cards.pop(),
            showAnswer: false
        }
    }

    private showAnswer = (): void => {
        this.setState({ showAnswer: true });
    }

    private showNextCard = (): void => {
        this.setState({ showAnswer: false });
        this.setState({ currentCard: this.cards.pop() });
    }

    private skipCard = (): void => {
        this.cards.unshift(this.state.currentCard);
        this.showNextCard();
    }

    private handleReview = (correct: boolean): void => {
        // TODO
        console.log("ANSWER: " + correct);
        this.showNextCard();
    }

    private noCardsLeft = (): boolean => {
        return this.state.currentCard === undefined;
    }

    private shuffle = (): void => {
        for (let currentIndex = this.cards.length - 1; currentIndex > 0; currentIndex--) {
            const newIndex = Math.floor(Math.random() * (currentIndex + 1));
            const temp = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[newIndex];
            this.cards[newIndex] = temp;
        }
    }

    public render() {
        if (this.noCardsLeft()) {
            return <h4>No more cards left!</h4>
        }

        return (
            <div className="col col-center review space-between">
                <h2>Review</h2>

                <div className="col col-center review-card">
                    <section>
                        <Card
                            front={this.state.currentCard.front}
                            back={this.state.showAnswer ? this.state.currentCard.back : undefined}
                        />
                    </section>
                    {this.state.showAnswer ? null : <Button name="Show answer" action={this.showAnswer} />}
                </div>

                <section>
                    {this.state.showAnswer ? <Button name="Yes" action={() => this.handleReview(true)} /> : null}
                    {this.state.showAnswer ? <Button name="No" action={() => this.handleReview(false)} /> : null}
                    <Button name="Skip" action={this.skipCard} />
                </section>
            </div>
        );
    }
}

interface IProps extends RouteComponentProps<{ topicId?: string }> {
}

interface IState {
    currentCard: CardEntity
    showAnswer: boolean
}