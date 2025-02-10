import { SearchOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "../assets/css/search.css";
import { Table } from "antd";

function Search({ onSearchChange, columns, dataSource }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(dataSource);
  const [error, setError] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <div className="search-container">
        <form className="search-form">
          <InputGroup className="search-group">
            <SearchOutlined className="search-icon" />
            <Form.Control
              onChange={handleSearchChange}
              placeholder="Search..."
              className="search-bar"
            ></Form.Control>
          </InputGroup>
        </form>
      </div>
      {search && <h4>Results for "{search}"</h4>}
      {search && (
        <div>
          <Table columns={columns} dataSource={filteredData} pagination />
        </div>
      )}
    </>
  );
}

export default Search;
