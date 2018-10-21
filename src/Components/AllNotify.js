import React, { Component } from "react";
import { Link } from "react-router-dom";

import { graphql, compose, withApollo } from "react-apollo";
import QueryAllEvents from "../GraphQL/QueryAllEvents";
import QueryAllNotify from "../GraphQL/QueryAllNotify";
import MutationDeleteEvent from "../GraphQL/MutationDeleteEvent";
import MutationdeltNotification from "../GraphQL/MutationDeleteNotification";

import moment from "moment";

class AllNotifs extends Component {

    state = {
        busy: false,
    }

    async handleDeleteClick(event, e) {
        e.preventDefault();

        if (window.confirm(`Are you sure you want to delete event ${event.id}`)) {
            const { deltNotification } = this.props;
            console.log('del pressed');
            console.log(this.props);
            console.log(event);
            await deltNotification(event);
        }
    }

    handleSync = async () => {
        const { client } = this.props;
        const query = QueryAllNotify;
        console.log('sync query')
        console.log(query)
        this.setState({ busy: true });

        await client.query({
            query,
            fetchPolicy: 'network-only',
        });

        this.setState({ busy: false });
    }

    renderEvent = (event) => (
        <Link to={`/event/${event.id}`} Notifications={event} className="card" key={event.id}>
            <div className="content">
                <div className="header">{event.title}</div>
            </div>
            <div className="content">
                <p><i className="icon calendar"></i>{event.startDate}</p>
                <p><i className="icon calendar"></i>{event.endDate}</p>
            </div>
            <div className="content">
                <div className="description"><i className="icon info circle"></i>{event.content}</div>
            </div>
            <button className="ui bottom attached button" onClick={this.handleDeleteClick.bind(this, event)}>
                <i className="trash icon"></i>
                Delete
            </button>
        </Link>
    );

    render() {
        const { busy } = this.state;
        const { Notificationss } = this.props;

        return (
            <div>
                <div className="ui clearing basic segment">
                    <h1 className="ui header left floated">All Events</h1>
                    <button className="ui icon left basic button" onClick={this.handleSync} disabled={busy}>
                        <i aria-hidden="true" className={`refresh icon ${busy && "loading"}`}></i>
                        Sync with Server
                    </button>
                </div>
                <div className="ui link cards">
                    <div className="card blue">
                        <Link to="/newEvent" className="new-event content center aligned">
                            <i className="icon add massive"></i>
                            <p>Create new event</p>
                        </Link>
                    </div>
                    {[].concat(Notificationss).map(this.renderEvent)}
                </div>
            </div>
        );
    }

}

export default withApollo(compose(
    graphql(
        QueryAllNotify,
        {
            options: {
                fetchPolicy: 'cache-first',
            },
            props: ({ data: { listNotifications = { items: [] } } }) => ({
                Notificationss: listNotifications.items
            })
        }
    ),
    graphql(
        MutationdeltNotification,
        {
            options: {
                update: (proxy, { data: { deltNotification } }) => {
                    const query = QueryAllNotify;
                    const data = proxy.readQuery({ query });
                    console.log('update noti called');
                    console.log(deltNotification);
                    console.log(data);
                    data.listNotifications.items = data.listNotifications.items.filter(event => event.id !== deltNotification.id);

                    proxy.writeQuery({ query, data });
                }
            },
            props: (props) => ({
                deltNotification: (event) => {
                    console.log('del notif called:');
                    console.log(event);
                    return props.mutate({
                        variables: { id: event.id },
                        optimisticResponse: () => ({
                            deltNotification: {
                                ...event, __typename: 'Notifications'
                            }
                        }),
                    });
                }
            })
        }
    )
)(AllNotifs));
