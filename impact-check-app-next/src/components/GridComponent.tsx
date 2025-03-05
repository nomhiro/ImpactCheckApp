import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, RowClassParams, CellClickedEvent, CellDoubleClickedEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "../components/GridComponent.css";
import Modal from 'react-modal';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * 監2を表示/編集するコンポーネント
 * @returns 
 */
const GridComponent = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCellData, setSelectedCellData] = useState<any>(null);

  /**
   * セルのサイズを自動調整するための設定
   */
  const autoSizeStrategy = useMemo(() => {
    return {
      // type: 'fitCellContents' as 'fitCellContents',
    };
  }, []);

  const enableCellSpan = true;

  /**
   * 初期データを取得する
   * 本来はAPIからデータを取得するが、今回はローカルのJSONファイルから取得する
   */
  useEffect(() => {
    fetch("/data/sample_kan2.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));

    fetch("/data/sample_kab2_column.json")
      .then((result) => result.json())
      .then((columnDefs) => {
        // すべての列の幅を150に設定
        const setColumnWidth = (columns: ColDef[]): ColDef[] => {
          return columns.map((colDef: ColDef) => ({
            ...colDef,
            width: 170,
            children: colDef.children ? setColumnWidth(colDef.children) : undefined,
            cellRenderer: 'tooltipRenderer', // カスタムセルレンダラーを設定
            headerTooltip: colDef.headerName // ヘッダーにツールチップを設定
          }));
        };

        const updatedColumnDefs = setColumnWidth(columnDefs);
        setColumnDefs(updatedColumnDefs);
        console.log('columnDefs: ', updatedColumnDefs);
      });
  }, []);

  /**
   * 行追加イベントを監視する
   */
  useEffect(() => {
    /**
     * 行追加イベントハンドラ
     * @param event 
     */
    const handleAddRow = (event: CustomEvent) => {
      const randomIndex = Math.floor(Math.random() * rowData.length);
      const newRow = { ...rowData[randomIndex], changePoint: event.detail, isNew: true };
      const newRowData = [...rowData.slice(0, randomIndex + 1), newRow, ...rowData.slice(randomIndex + 1)];
      setRowData(newRowData);
    };

    window.addEventListener("addRow", handleAddRow as EventListener);

    return () => {
      window.removeEventListener("addRow", handleAddRow as EventListener);
    };
  }, [rowData]);

  /**
   * 行のクラスを設定する
   * @param params 
   * @returns 
   */
  const getRowClass = (params: RowClassParams) => {
    return params.data.isNew ? 'new-row' : '';
  };

  /**
   * セルがクリックされた時のイベントハンドラ。クリックされたセルのデータを取得し、モーダルを表示する
   * @param event 
   */
  const handleCellDoubleClicked = (event: CellDoubleClickedEvent) => {
    if (!isModalOpen) {
      setSelectedCellData(event.data);
      setIsModalOpen(true);
      console.log('event: ', event);
    }
  };

  /**
   * モーダルを閉じる
   */
  const closeModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
      setSelectedCellData(null);
    }
  };

  /**
   * カスタムセルレンダラー
   * @param params 
   * @returns 
   */
  const tooltipRenderer = (params: any) => {
    return (
      <div title={params.value}>
        {params.value}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        components={{ tooltipRenderer }} // カスタムセルレンダラーを登録
        // autoSizeStrategy={autoSizeStrategy}
        enableCellSpan={enableCellSpan}
        getRowClass={getRowClass}
        onCellDoubleClicked={handleCellDoubleClicked}
        domLayout="autoHeight"
        suppressHorizontalScroll={false}
      />
      {isModalOpen && selectedCellData && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Cell Edit Modal"
          className="modal"
          overlayClassName="overlay"
          appElement={document.getElementById('__next') || undefined}
        >
          <h2>セル編集</h2>
          <form>
            <label>
              <input
                type="radio"
                name="impact"
                value="影響なし"
                defaultChecked={selectedCellData["影響あり/なし"] === "影響なし"}
              />
              影響なし
            </label>
            <label>
              <input
                type="radio"
                name="impact"
                value="影響あり"
                defaultChecked={selectedCellData["影響あり/なし"] === "影響あり"}
              />
              影響あり
            </label>
            <label>
              AIからの提案:
              <textarea value={selectedCellData["AIからの提案"]} readOnly />
            </label>
            <label>
              理由:
              <textarea defaultValue={selectedCellData["理由"]} />
            </label>
            <button type="button" onClick={closeModal}>閉じる</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default GridComponent;