import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class Home extends Component {
  render() {
    return (
      <div className="content-wrap">
        <div className="content">
          <h1>Добро пожаловать в это приложение</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio voluptates suscipit porro repellat! Tempore, repellendus rerum. Enim praesentium eaque necessitatibus, cupiditate, veniam aperiam, eligendi quos molestias saepe voluptatem modi amet.</p>
          <h3>Вам доступны следующие разделы:</h3>
          <div className="sections">
            {this.props.links.map(l => {
              return (
                <Link to={l.href} className="button grey" key={l.href}>{l.name}</Link>
              )
            })}
          </div>
          <h3>Заголовок</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio voluptates suscipit porro repellat! Tempore, repellendus rerum. Enim praesentium eaque necessitatibus, cupiditate, veniam aperiam, eligendi quos molestias saepe voluptatem modi amet.</p>
        </div>
      </div>
    );
  }
}