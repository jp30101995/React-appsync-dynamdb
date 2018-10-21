import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

import moment from 'moment';

import QueryGetEvent from "../GraphQL/QueryGetEvent";
import QueryGetNotification from "../GraphQL/QueryGetNotify";
import EventComments from "./EventComments";

class ViewNotification extends Component {

    render() {
        const { Notifications, loading } = this.props;
        console.log(this.props);
        return (
            <div className={`ui container raised very padded segment ${loading ? 'loading' : ''}`}>
                <Link to="/" className="ui button">Back to events</Link>
                <div className="ui items">
                    <div className="item">
                        {Notifications && <div className="content">
                            <div className="header">{Notifications.title}</div>
                            <div className="extra"><i className="icon calendar"></i>{Notifications.startDate}</div>
                            <div className="extra"><i className="icon clock"></i>{Notifications.endDate}</div>
                            <div className="description">{Notifications.content}</div>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }

}

const ViewEventWithData = graphql(
    QueryGetNotification,
    {
        options: ({ match: { params: { id } } }) => ({
            variables: { id },
            fetchPolicy: 'cache-and-network',
        }),
        props: ({ data: { getNotifications: Notifications, loading} }) => ({
            Notifications,
            loading,
        }),
    },
)(ViewNotification);

export default ViewEventWithData;