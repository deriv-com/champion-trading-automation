import { Form, Button, Segmented } from "antd";
import { BottomActionSheet } from "../BottomActionSheet";
import { DownOutlined } from "@ant-design/icons";
import { InputField } from "../InputField";
import {
  LabelPairedArrowLeftMdBoldIcon,
  LabelPairedCircleQuestionMdBoldIcon,
  MarketDerivedVolatility1001sIcon,
} from "@deriv/quill-icons";
import { useState } from "react";
import { TradeErrorBoundary } from "../ErrorBoundary/TradeErrorBoundary";
import { TradeStrategy } from "../../types/trade";
import { useTrade } from "../../contexts/TradeContext";
import { MarketInfo } from "../../types/market";
import MarketSelector from "../MarketSelector";
import "./styles.scss";

import { FormValues, StrategyFormProps } from "../../types/form";

export function StrategyForm({
  strategyType,
  strategyId,
  onBack,
}: StrategyFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMarketSelector, setShowMarketSelector] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketInfo>();
  const { submitTrade } = useTrade();

  const handleSubmit = async (values: FormValues) => {
    // for now some values here are static 
    // once we have the api we will make this function dynamic based on the api schema
    const newBot = {
      id: Date.now().toString(),
      name: values.botName || "New Strategy Bot",
      market: values.market,
      tradeType: values.tradeType,
      strategy: "Custom",
      params: [
        { key: "repeat_trade", label: "Repeat trade", value: values.repeatTrade },
        { key: "initial_stake", label: "Initial stake", value: values.initialStake },
      ],
    };

    const storedBots = JSON.parse(localStorage.getItem("bots") || "[]");
    const updatedBots = [...storedBots, newBot];
    localStorage.setItem("bots", JSON.stringify(updatedBots));
    try {
      setIsSubmitting(true);

      // Submit trade through trade context
      const sessionId = await submitTrade(values, strategyId as TradeStrategy);

      console.log("Bot created with session ID:", sessionId);

      /* Add to processing stack
      addProcess({
        sessionId,
        symbol: values.asset as string,
        strategy: strategyType,
        status: TradeStatusEnum.PENDING,
        is_completed: false,
        tradeInfo: {
          session_id: sessionId,
          contracts: [],
          start_time: new Date().toISOString(),
          end_time: '',
          total_profit: 0,
          win_profit: 0,
          loss_profit: 0,
          strategy: strategyType,
          initial: values.amount as number,
          ...values
        }
      });

      // Call the provided onSubmit handler if needed
      // await onSubmit?.(values);
      */
      // Handle successful submission (e.g., redirect or show success message)
    } catch (error) {
      console.error("Failed to create bot:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };


  return (
    <TradeErrorBoundary onReset={handleReset}>
      <div className="strategy-form-container">
        <div className="strategy-form-header">
          <div className="header-left">
            <Button
              type="text"
              icon={<LabelPairedArrowLeftMdBoldIcon />}
              className="back-button"
              onClick={onBack}
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
                  suffix={<DownOutlined />}
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
            Create bot
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
    </TradeErrorBoundary>
  );
}
