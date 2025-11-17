import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFileThunk } from "../../api/files/filesSlice";

/**
 * Компонент для загрузки файлов
 * Использует Redux для управления состоянием загрузки
 */
const FileUpload = ({ onUploadSuccess, acceptedTypes = "*" }) => {
  const dispatch = useDispatch();
  const { loading, error, uploadedFile } = useSelector((state) => state.files);
  const [fileList, setFileList] = useState([]);

  const handleUpload = async ({ file }) => {
    try {
      const result = await dispatch(
        uploadFileThunk({ file, language: "uz" })
      ).unwrap();

      message.success(`Файл загружен: ${result.fileName}`);
      setFileList([]);

      // Если передан callback, вызываем его с результатом
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      message.error(`Ошибка загрузки: ${err}`);
    }
  };

  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Файл должен быть меньше 10MB!");
      return Upload.LIST_IGNORE;
    }
    return false; // предотвращаем автоматическую загрузку
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div>
      <Upload
        fileList={fileList}
        beforeUpload={beforeUpload}
        customRequest={handleUpload}
        onChange={handleChange}
        accept={acceptedTypes}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />} loading={loading} disabled={loading}>
          {loading ? "Загрузка..." : "Выбрать файл"}
        </Button>
      </Upload>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

      {uploadedFile && (
        <div style={{ marginTop: 12, color: "green" }}>
          <strong>Загружено:</strong>{" "}
          <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer">
            {uploadedFile.fileName}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
