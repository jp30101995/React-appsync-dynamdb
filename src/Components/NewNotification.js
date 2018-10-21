import React, { Component } from "react";
import { Link } from "react-router-dom";

import { v4 as uuid } from "uuid";
import { graphql } from "react-apollo";
import QueryAllEvents from "../GraphQL/QueryAllEvents";
import QueryAllNotify from "../GraphQL/QueryAllNotify";
import QueryGetEvent from "../GraphQL/QueryGetEvent";
import MutationCreateEvent from "../GraphQL/MutationCreateEvent";
import MutationcreateNotification from "../GraphQL/MutationCreateNotify";
import QueryGetNotify from "../GraphQL/QueryGetNotify";
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { nearest15min } from "../Utils";
import DateTimePickerCustomInput from "./DateTimePickerCustomInput";

class NewNotify extends Component {

    static defaultProps = {
        createNotification: () => null,
    }

    state = {
        event: {
            title: '',
            content: '',
            startDate: 0,
            endDate: 0,
        }
    };

    handleChange(field, { target: { value } }) {
        const { event } = this.state;

        if(field === 'startDate' || field === 'endDate'){
            event[field] = parseInt(value)
        }else{
            event[field] = value;
        }

        this.setState({ event });
    }

    handleSave = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const { createNotification, history } = this.props;
        console.log('after save click')
        console.log(this.props);
        const { event } = this.state;

        await createNotification({ ...event });

        history.push('/');
    }

    render() {
        const { event } = this.state;

        return (
            <div className="ui container raised very padded segment">
                <h1 className="ui header">Create an Notification</h1>
                <div className="ui form">
                    <div className="field required eight wide">
                        <label htmlFor="title">title</label>
                        <input type="text" id="title" value={event.title} onChange={this.handleChange.bind(this, 'title')} />
                    </div>
                    <div className="field required eight wide">
                        <label htmlFor="content">content</label>
                        <input type="text" id="content" value={event.content} onChange={this.handleChange.bind(this, 'content')} />
                    </div>
                    <div className="field required eight wide">
                        <label htmlFor="startDate">startDate</label>
                        <input type="number" id="startDate" value={event.startDate} onChange={this.handleChange.bind(this, 'startDate')} />
                    </div>
                    <div className="field required eight wide">
                        <label htmlFor="endDate">endDate</label>
                        <input type="number" id="endDate" value={event.endDate} onChange={this.handleChange.bind(this, 'endDate')} />
                    </div>
                    <div className="ui buttons">
                        <Link to="/" className="ui button">Cancel</Link>
                        <div className="or"></div>
                        <button className="ui positive button" onClick={this.handleSave}>Save</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default graphql(
    MutationcreateNotification,
    {
        props: (props) => ({
            createNotification: (event) => {
                console.log('event print');
                console.log(event);
                return props.mutate({
                    update: (proxy, { data: { createNotification } }) => {
                        // Update QueryAllEvents
                        const query = QueryAllNotify;
                        const data = proxy.readQuery({ query });

                        data.listNotifications.items = [...data.listNotifications.items.filter(e => e.id !== createNotification.id), createNotification];

                        proxy.writeQuery({ query, data });

                        // Create cache entry for QueryGetEvent
                        const query2 = QueryGetNotify;
                        const variables = { id: createNotification.id, startDate: createNotification.startDate };
                        const data2 = { getNotifications: { ...createNotification } };

                        proxy.writeQuery({ query: query2, variables, data: data2 });
                    },
                    variables: event,
                    optimisticResponse: () => ({
                        createNotification: {
                            ...event, id: uuid(), __typename: 'NotificationTable'
                        }
                    }),
                })
            }
        })
    }
)(NewNotify);
