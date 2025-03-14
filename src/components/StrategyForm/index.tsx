import { Form, Button, Segmented } from "antd";
import { BottomActionSheet } from "../BottomActionSheet";
import { InputField } from "../InputField";
import {
  StandaloneChevronDownRegularIcon, 
  LegacyClose2pxIcon,
  LabelPairedArrowLeftMdBoldIcon,
  LabelPairedCircleQuestionMdBoldIcon,
  MarketDerivedVolatility1001sIcon,
} from "@deriv/quill-icons";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, useBots } from "../../hooks/useBots";
import { TradeErrorBoundary } from "../ErrorBoundary/TradeErrorBoundary";
import { TradeStrategy } from "../../types/trade";
import { useTrade } from "../../contexts/TradeContext";
import { useNotification } from "../../contexts/NotificationContext";
import { MarketInfo } from "../../types/market";
import MarketSelector from "../MarketSelector";
import "./styles.scss";

import { FormValues, StrategyFormProps } from "../../types/form";

export function StrategyForm({
  strategyType,
  strategyId,
  onBack,
  editBot,
}: StrategyFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMarketSelector, setShowMarketSelector] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketInfo>();
  const [formDirty, setFormDirty] = useState(false);
  const initialValues = useRef<FormValues | null>(null);
  const { submitTrade } = useTrade();
  const { addBot, updateBot } = useBots();
  const { showNotification, showSimpleNotification } = useNotification();
  const navigate = useNavigate();
  const isEditMode = !!editBot;

  // Set initial form values when in edit mode
  useEffect(() => {
    if (isEditMode && editBot) {
      // Find param values from the bot
      const repeatTradeParam = editBot.params.find(param => param.key === "repeat_trade");
      const initialStakeParam = editBot.params.find(param => param.key === "initial_stake");
      
      // Set form values
      const values = {
        botName: editBot.name,
        tradeType: editBot.tradeType,
        market: editBot.market,
        repeatTrade: repeatTradeParam ? repeatTradeParam.value : 2,
        initialStake: initialStakeParam ? initialStakeParam.value : 10,
      };
      
      form.setFieldsValue(values);
      initialValues.current = values;
    }
  }, [isEditMode, editBot, form]);

  // Track form changes
  const handleFormChange = () => {
    if (!initialValues.current) return;
    
    const currentValues = form.getFieldsValue();
    const isDirty = Object.keys(currentValues).some(key => {
      // @ts-expect-error - We know these keys exist in both objects
      return currentValues[key] !== initialValues.current[key];
    });
    
    setFormDirty(isDirty);
  };

  useEffect(() => {
    // Reset form dirty state when component mounts
    setFormDirty(false);
  }, []);

  const handleSubmit = async (values: FormValues) => {
    // for now some values here are static 
    // once we have the api we will make this function dynamic based on the api schema
    const botData : Bot = {
      id: isEditMode && editBot ? editBot.id : Date.now().toString(),
      name: values.botName?.toString() || "New Strategy Bot",
      market: values.market?.toString() || "",
      tradeType: values.tradeType?.toString() || "",
      strategy: isEditMode && editBot ? editBot.strategy : "Custom",
      params: [
        { key: "repeat_trade", label: "Repeat trade", value: Number(values.repeatTrade) },
        { key: "initial_stake", label: "Initial stake", value: Number(values.initialStake) },
      ],
    };

    try {
      setIsSubmitting(true);

      if (isEditMode) {
        // Update existing bot
        updateBot(botData);
        console.log("Bot updated successfully:", botData);
        
        // Show simple notification with the new design
        showSimpleNotification('Changes has been saved successfully.');
        
        // Close the drawer first, then navigate
        onBack?.();
        navigate("/bots");
      } else {
        // Add new bot
        addBot(botData);
        
        // Submit trade through trade context (only for new bots)
        const sessionId = await submitTrade(values, strategyId as TradeStrategy);
        console.log("Bot created with session ID:", sessionId);
        
        // Show simple notification with the new design
        showSimpleNotification('Bot has been created successfully.');
        
        // Navigate to the bots list page
        navigate("/bots");
      }
    } catch (error) {
      console.error("Failed to create/update bot:", error);
      
      // Show error notification
      showNotification(
        'Error',
        `Failed to ${isEditMode ? 'update' : 'create'} bot. Please try again.`,
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFormDirty(false);
  };

  const handleBackClick = () => {
    if (isEditMode && formDirty) {
      setShowConfirmation(true);
    } else {
      onBack?.();
    }
  };

  const handleConfirmDiscard = () => {
    setShowConfirmation(false);
    handleReset();
    onBack?.();
  };

  const handleCancelDiscard = () => {
    setShowConfirmation(false);
  };


  return (
    <TradeErrorBoundary onReset={handleReset}>
      <div className="strategy-form-container">
        <div className="strategy-form-header">
          <div className="header-left">
            <Button
              type="text"
              icon={isEditMode ? <LegacyClose2pxIcon iconSize='xs' /> : <LabelPairedArrowLeftMdBoldIcon />}
              className="back-button"
              onClick={handleBackClick}
            />
          </div>
          <div className="header-right">
            <Button
              type="text"
              shape="circle"
              icon={<LabelPairedCircleQuestionMdBoldIcon />}
              className="help-button"
            />
          </div>
        </div>

        <h1 className="strategy-title">{strategyType} strategy</h1>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="strategy-form"
          initialValues={{
            tradeType: "Rise",
            market: "Volatility 100 (1s) Index",
            initialStake: 10,
            repeatTrade: 2,
          }}
          onValuesChange={handleFormChange}
        >
          <Form.Item name="botName">
            <InputField
              label="Bot name"
              type="text"
              className="bot-name-input"
              defaultValue={'Test-01'}
            />
          </Form.Item>

          <h2 className="parameters-title">Parameters</h2>

          <Form.Item name="tradeType" className="trade-type-item">
            <Segmented
              block
              options={[
                { label: "Rise", value: "Rise" },
                { label: "Fall", value: "Fall" },
              ]}
            />
          </Form.Item>

          <Form.Item name="market" className="market-item">
                <InputField 
                  type="selectable" 
                  value={"Volatility 100 (1s) Index"}
                  prefix={<MarketDerivedVolatility1001sIcon fill='#000000' iconSize='sm' />}
                  suffix={<StandaloneChevronDownRegularIcon />}
                  onClick={() => setShowMarketSelector(true)}
                />
          </Form.Item>

          <Form.Item name="initialStake" className="stake-item">
            <InputField
              label="Initial stake"
              type="number-prefix"
              suffix="USD"
            />
          </Form.Item>

          <Form.Item name="repeatTrade" className="repeat-item">
            <InputField
              label="Repeat trade"
              type="number"
              className="repeat-input"
            />
          </Form.Item>
        </Form>

        <div className="form-footer">
          <Button
            type="primary"
            block
            className="create-button"
            onClick={() => form.submit()}
            loading={isSubmitting}
          >
            {isEditMode ? "Save bot" : "Create bot"}
          </Button>
        </div>
      </div>

      {/* Market Selector */}
      <BottomActionSheet
        isOpen={showMarketSelector}
        onClose={() => setShowMarketSelector(false)}
        className="market-selector-drawer"
        height="80vh"
      >
        <MarketSelector
          onSelectMarket={(market) => {
            setSelectedMarket(market);
            form.setFieldsValue({ market: market.displayName });
            setShowMarketSelector(false);
          }}
          selectedMarket={selectedMarket}
        />
      </BottomActionSheet>

      {/* Confirmation Dialog */}
      <BottomActionSheet
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        className="confirmation-dialog"
        height="auto"
      >
        <div className="confirmation-content">
          <h2>Discard changes?</h2>
          <p>You have unsaved changes. If you close now, your changes will be lost.</p>
          <div className="confirmation-buttons">
            <Button 
              type="primary" 
              block 
              onClick={handleConfirmDiscard}
              className="confirm-button"
            >
              Confirm
            </Button>
            <Button 
              block 
              onClick={handleCancelDiscard}
            >
              Cancel
            </Button>
          </div>
        </div>
      </BottomActionSheet>
    </TradeErrorBoundary>
  );
}
