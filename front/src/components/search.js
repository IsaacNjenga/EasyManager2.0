import { SearchOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "../assets/css/search.css";
import { Table } from "antd";

function Search({ onSearchChange, columns, dataSource }) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Dynamically filter data (instead of using useEffect & state)
  const filteredData = dataSource.filter((item) =>
    Object.values(item).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(search)
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
              value={search}
            />
          </InputGroup>
        </form>
      </div>

      {search && <h4>Results for "{search}"</h4>}
      {search ? (
        <Table columns={columns} dataSource={filteredData} pagination />
      ) : null}
    </>
  );
}

export default Search;
