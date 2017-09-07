import React from 'react';
import { Card, Calendar } from 'antd';
import Link from "gatsby-link"
import MediaQuery from 'react-responsive';

import './index.css';
const styles = {
  link: 'link'
}

const Sidebar = (props) => {
  const {categoryList, tagsList} = props;
  const { archiveMap, linkMap, width = '90%' } = props;
  const categoryMap = categoryList.reduce((acc, e) => {
    acc[e] = acc[e] ? acc[e] + 1 : 1;
    return acc;
  }, {});
  const tagsMap = tagsList.reduce((acc, e) => {
    acc[e] = acc[e] ? acc[e] + 1 : 1;
    return acc;
  }, {});
  const categories = [];
  if (categoryMap) {
    for (const [category, count] of Object.entries(categoryMap)) {
      categories.push(
        <Link
          to={`/categories/${category}`}
          key={category}
          className={styles.link}
        >
          <p>{category} {`(${count})`}</p>
        </Link>,
      );
    }
  }
  const archives = [];
  if (archiveMap) {
    for (const [url, info] of Object.entries(archiveMap)) {
      archives.push(
        <Link to={`/archives/${url}`} key={url} className={styles.link}>
          <p>{info.text} {`(${info.count})`}</p>
        </Link>,
      );
    }
  }
  return (
    <div>
      <Card
        title="分类"
        extra={<Link to="/categories">More</Link>}
        style={{
          width,
          float: 'right',
          marginTop: 20,
          padding: '0 10px 10px',
        }}
        bordered={false}
        bodyStyle={{ margin: '10px 0 0 10px' }}
      >
        {categories}
      </Card>
      <Card
        title="归档"
        extra={<Link to="/archives">More</Link>}
        style={{
          width,
          float: 'right',
          marginTop: 20,
          padding: 10,
        }}
        bordered={false}
        bodyStyle={{ margin: '10px 0 0 10px' }}
      >
        {archives}
      </Card>
      <Card
        title="友情链接"
        style={{
          width,
          float: 'right',
          marginTop: 20,
          padding: 10,
        }}
        bordered={false}
        bodyStyle={{ margin: '10px 0 0 10px' }}
      >
        {linkMap &&
          linkMap.map((item, index) => (
            <a
              href={item.url}
              key={index}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>{item.title}</p>
            </a>
          ))}
      </Card>
    </div>
  );
}

export default Sidebar;