import { Button } from "antd";
import {
  MoreOutlined,
  CaretRightOutlined
} from "@ant-design/icons";
import {
  StandalonePenRegularIcon,
  StandaloneTrashRegularIcon,
} from "@deriv/quill-icons";
import { useState } from "react";
import { BottomActionSheet } from "../../../BottomActionSheet";
import "./styles.scss";

interface BotParam {
  key: string;
  label: string;
  value: string | number;
}

interface Bot {
  id: string;
  name: string;
  market: string;
  tradeType: string;
  strategy: string;
  params: BotParam[];
}

interface BotCardProps {
  bot: Bot;
  onRun: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

/**
 * BotCard: Card component that displays a trading bot with its details and actions.
 * Inputs: { bot: Bot, onRun: () => void } - Bot data and callback for run action
 * Output: JSX.Element - Card with bot details, parameters, and action buttons
 */
export function BotCard({ bot, onRun, onDelete, onEdit }: BotCardProps) {
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleOpenActionSheet = () => {
    setIsActionSheetOpen(true);
    setShowDeleteConfirmation(false);
  };

  const handleCloseActionSheet = () => {
    setIsActionSheetOpen(false);
    setShowDeleteConfirmation(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
    handleCloseActionSheet();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    handleCloseActionSheet();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="bot-card">
      <div className="bot-card__header">
        <h3 className="bot-card__title">{bot.name}</h3>
        <Button
          type="text"
          icon={<MoreOutlined />}
          className="bot-card__more-btn"
          onClick={handleOpenActionSheet}
        />
      </div>

      <div className="bot-card__market">
        {bot.market} | {bot.tradeType}
      </div>

      <div className="bot-card__footer">
        <div className="bot-card__params-scroll">
          <div className="bot-card__strategy-tag">{bot.strategy}</div>

          {bot.params.map((param) => (
            <div key={param.key} className="bot-card__param-value">
              {param.label}: {param.value}
            </div>
          ))}
        </div>

        <Button
          icon={<CaretRightOutlined />}
          className="bot-card__run-btn"
          onClick={onRun}
        >
          Run
        </Button>
      </div>

      <BottomActionSheet
        isOpen={isActionSheetOpen}
        onClose={handleCloseActionSheet}
        height={showDeleteConfirmation ? 350 : 200}
      >
        {!showDeleteConfirmation ? (
          <div className="bot-action-options">
            <div className="bot-action-option" onClick={handleEdit}>
              <StandalonePenRegularIcon className="bot-action-icon" />
              <span>Edit</span>
            </div>
            <div className="bot-action-option" onClick={handleDeleteClick}>
              <StandaloneTrashRegularIcon className="bot-action-icon" />
              <span>Delete</span>
            </div>
          </div>
        ) : (
          <div className="bot-delete-confirmation">
            <h2 className="bot-delete-confirmation__title">Delete bot?</h2>
            <p className="bot-delete-confirmation__message">
              This action cannot be undone. Deleting this bot will remove all its settings and data.
            </p>
            <p className="bot-delete-confirmation__question">
              Are you sure you want to proceed?
            </p>
            <div className="bot-delete-confirmation__actions">
              <Button 
                type="primary"
                className="bot-delete-confirmation__confirm modal-btn" 
                onClick={handleConfirmDelete}
              >
                Confirm
              </Button>
              <Button 
                className="bot-delete-confirmation__cancel modal-btn" 
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </BottomActionSheet>
    </div>
  );
}
