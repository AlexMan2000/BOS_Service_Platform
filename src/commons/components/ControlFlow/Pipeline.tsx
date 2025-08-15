import styles from "./Pipeline.module.less"
import TimelineBar from "./TimelineBar";
import { Button, message } from "antd";
import { useIntl } from "react-intl";
import ThemedButton from "../Buttons/ThemedButton";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import React from "react";
import SwitchBar from "./SwitchBar";
import { useFormState } from "@/hooks/useFormState";



interface PipelineProps {
  audit?: boolean;  // admin
  viewDetails?: boolean;  // view details
  recordIdx?: number;
  itemNames: string[];
  children: any;
  persistence?: any;
  initialStates?: any;
  sideEffects?: (Function | undefined)[];
  timelined?: boolean; // do you need a timeline bar up top?
  timelinedClickable?: boolean; // do you need the timeline to be clickable?
  sequential?: boolean; // do you need the timeline to be sequential/causal?
  templateType?: string;
  exitPipelinePrev?: () => void;
  style?: React.CSSProperties;
}

interface PipelineState {
  [key: string]: any
}


interface PipelineContext {
  activeTab: number;
  cache: any;
  setActiveTab: Function;
  disabledStates: boolean[];
  disabledSetters: Function[];
  pipelineStates: PipelineState[];
  pipelineStateSetters: Function[];
  allowNexts: boolean[];
  allowNextSetters: Function[];
  displayHeaders: boolean[];
  displayHeaderSetters: Function[];
  displayFooters: boolean[];
  displayFooterSetters: Function[];
  displayFooterTextSetters: Function[];
  nextCallbackSetters: (Function | undefined)[];
  displayBackButtonSetters: Function[];
  displayNextButtonSetters: Function[];
  templateType: string;
}

const PipelineContext = createContext<PipelineContext | undefined>(undefined);


const usePipeline = () => {
  const context = useContext(PipelineContext);

  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
};


const Pipeline = (props: PipelineProps) => {

  const { persistence
        , exitPipelinePrev
        , itemNames
        , timelined
        , timelinedClickable
        , children
        , templateType
        , sequential
        , initialStates = Array(itemNames.length).fill({})
        , sideEffects = Array(itemNames.length).fill(()=>{})
        , audit
        , recordIdx
        , viewDetails
        , style } = props;


  let childrens: any[] = []

  if (!children) {
    throw new Error("Must provide at least one child element");
  }

  if (!Array.isArray(children)) {
    if (itemNames.length != 1) {
      throw new Error("Num of items mismatch with num of titles!");
    }
    childrens = [children];
  } else {
    childrens = children;
    if (itemNames.length !== children.length) {

      throw new Error("Num of items mismatch with num of titles!");
    }
  }


  const length = itemNames.length;
  const [activeTab, setActiveTab] = useState<number>(0);
  const [disabledStates, setDisabledStates] = useState<boolean[]>(Array(length).fill(false))
  const [allowNexts, setAllowNexts] = useState<boolean[]>(Array(length - 1).fill(false))
  const [pipelineStates, setPipelineStates] = useState<PipelineState[]>(initialStates);
  const [nextCallbacks, setNextCallbacks] = useState<(Function | undefined)[]>(Array(length).fill(undefined))
  const [backCallbacks, setBackCallbacks] = useState<(Function | undefined)[]>(Array(length).fill(undefined))
  const [displayHeaders, setDisplayHeaders] = useState<boolean[]>(Array(length).fill(false))
  const [displayFooters, setDisplayFooters] = useState<boolean[]>(Array(length).fill(false))
  const [displayBackButtons, setDisplayBackButtons] = useState<boolean[]>(Array(length).fill(false))
  const [displayNextButtons, setDisplayNextButtons] = useState<boolean[]>(Array(length).fill(false))
  const [displayFooterTexts, setDisplayFooterTexts] = useState<(string[])[]>(Array(length).fill([]));
  const [importCallbacks, setImportCallbacks] = useState<(Function | undefined)[]>(Array(length).fill(undefined))
  const [exportCallbacks, setExportCallbacks] = useState<(Function | undefined)[]>(Array(length).fill(undefined))
  const [messageApi, contextHolder] = message.useMessage();

  // const [exitPipelineFunc, setExitPipelineFunc] = useState<Function | undefined>();
  const [formValidation, setFormValidations] = useState<(Promise<any> | undefined)[]>(Array(length).fill(undefined))
  const { forms } = useFormState(length);
  
  const [cache, setCache] = useState<any>(persistence);

  

  useEffect(() => {
    if (audit || viewDetails) {
      setPipelineStates(initialStates);
    }
  }, [initialStates]);


  useEffect(()=>{
    if (audit) {
      setDisabledStates(Array(length).fill(true));
    }
  }, [audit])


  const validateFormSetters = forms.map((_, index) => (validationProcess: Promise<any>) => {
    setFormValidations((prev) => {
      const newPromises = [...prev];
      newPromises[index] = validationProcess;
      return newPromises;
    });
  });


  const disabledSetters = disabledStates.map((_, index) => (state: boolean) => {
    setDisabledStates((prev) => {
      const newDisabledStates = [...prev];
      newDisabledStates[index] = state;
      return newDisabledStates;
    });
  });


  const allowNextSetters = allowNexts.map((_, index) => (state: boolean) => {
    setAllowNexts((prev) => {
      const newStates = [...prev];
      newStates[index] = state;
      return newStates;
    });
  });


  const displayHeaderSetters = displayHeaders.map((_, index) => (state: boolean) => {
    setDisplayHeaders((prev) => {
      const newStates = [...prev];
      newStates[index] = state;
      return newStates;
    });
  });


  const displayFooterSetters = displayFooters.map((_, index) => (state: boolean) => {
    setDisplayFooters((prev) => {
      const newStates = [...prev];
      newStates[index] = state;
      return newStates;
    });
  });


  const displayFooterTextSetters = displayFooterTexts.map((_, index) => (state: string[]) => {
    setDisplayFooterTexts((prev) => {
      const newStates = [...prev];
      newStates[index] = state;
      return newStates;
    });
  });


  const pipelineStateSetters = useMemo(() => Array(length).fill(0).map((_, index) => (state: PipelineState) => {
    setPipelineStates((prev) => {
      const newStates = [...prev];
      newStates[index] = state;
      return newStates;
    });
  }), [length]);


  const nextCallbackSetters = nextCallbacks.map((_, index) => (state: Function | undefined) => {
    setNextCallbacks((prev) => {
      const newCallbacks = [...prev];
      newCallbacks[index] = state;
      return newCallbacks;
    });
  });

  const importCallbackSetters = importCallbacks.map((_, index) => (state: Function | undefined) => {
    setImportCallbacks((prev) => {
      const newCallbacks = [...prev];
      newCallbacks[index] = state;
      return newCallbacks;
    });
  });


  const exportCallbackSetters = exportCallbacks.map((_, index) => (state: Function | undefined) => {
    setExportCallbacks((prev) => {
      const newCallbacks = [...prev];
      newCallbacks[index] = state;
      return newCallbacks;
    });
  });


  const backCallbackSetters = backCallbacks.map((_, index) => (state: Function | undefined) => {
    setBackCallbacks((prev) => {
      const newCallbacks = [...prev];
      newCallbacks[index] = state;
      return newCallbacks;
    });
  });

  const displayBackButtonSetters = displayBackButtons.map((_, index) => (state: boolean) => {
    setDisplayBackButtons((prev) => {
      const newStates = [...prev];
      newStates[index] = state;
      return newStates;
    });
  });

  const displayNextButtonSetters = displayNextButtons.map((_, index) => (state: boolean) => {
    setDisplayNextButtons((prev) => {
      const newStates = [...prev];
      newStates[index] = state;
      return newStates;
    });
  });


  const toNext = () => { setActiveTab(prev => Math.min(prev + 1, length - 1)) }

  const toPrev = () => { setActiveTab(prev => Math.max(prev - 1, 0)) }


  const resetPipelineState = (id: number) => {
    pipelineStateSetters[id]({});
  }

  const resetNextCallback = (id: number) => {
    nextCallbackSetters[id](undefined);
  }



  const resetAllowNext = (id: number) => {
    allowNextSetters[id](false);
  }

  const intl = useIntl();

  return (
    <PipelineContext.Provider
      value={{
        activeTab
        , cache
        , disabledStates
        , setActiveTab
        , disabledSetters
        , pipelineStates
        , pipelineStateSetters
        , allowNexts
        , allowNextSetters
        , displayHeaders
        , displayHeaderSetters
        , displayFooters
        , displayFooterSetters
        , displayFooterTextSetters
        , nextCallbackSetters
        , displayBackButtonSetters
        , displayNextButtonSetters
        , templateType: templateType ?? "teaser"
      }}
    >
      <div className={styles.container} style={style}>
        {timelined && <div className={styles.topContainer}>
          <div className={styles.tabs}>
            {sequential ?
              <TimelineBar
                onTabClickCallback={(tabIndex) => { 
                  if (timelinedClickable) {
                    setActiveTab(tabIndex) 
                  }
                }}
                currTabIndex={activeTab}
                currTabState={disabledStates[activeTab]}
                tabTexts={itemNames}></TimelineBar> :
              <SwitchBar
                currTabIndex={activeTab}
                tabTexts={itemNames}
                onTabClickCallback={async (tabIndex) => {
                  try {
                    if (tabIndex > activeTab) {
                      nextCallbacks[activeTab] && await nextCallbacks[activeTab]();
                    } else {
                      backCallbacks[activeTab] && await backCallbacks[activeTab]();
                    }
                    setTimeout(()=>{setActiveTab(tabIndex);}, 0);
                  } catch (error) {
                    console.error("Error in tab click:", error);
                    messageApi.error("Please fill in all required fields");
                  } 
                }}
              ></SwitchBar>}
          </div>
          {displayHeaders[activeTab] ?
            <div className={styles.buttonGroup}>
              {/* <Button className={styles.importButton}
                onClick={
                  () => {
                    importCallbacks[activeTab] && importCallbacks[activeTab]();
                  }
                }
              >
                {intl.formatMessage({ id: "button.import" })}
              </Button>
              <Button className={styles.exportButton}
                onClick={
                  () => {
                    exportCallbacks[activeTab] && exportCallbacks[activeTab]();
                  }
                }
              >
                {intl.formatMessage({ id: "button.export" })}
              </Button> */}
            </div>
            :
            <div className={styles.buttonGroup} >
              <Button className={styles.exportButton}
                onClick={
                  () => {
                    exportCallbacks[activeTab] && exportCallbacks[activeTab]();
                  }
                }
              >
                {intl.formatMessage({ id: "button.export" })}
              </Button>
            </div>
          }
        </div>}
        <div className={styles.contentContainer}>
          {contextHolder}
          <div className={styles.content}
          >
            {React.cloneElement(childrens[activeTab], {
              pipelineStateSetter: pipelineStateSetters[activeTab],
              pipelineState: pipelineStates[activeTab],
              allowNextSetter: allowNextSetters[activeTab],
              displayHeaderSetter: displayHeaderSetters[activeTab],
              displayFooterSetter: displayFooterSetters[activeTab],
              displayFooterTextSetters: displayFooterTextSetters[activeTab],
              nextCallbackSetter: nextCallbackSetters[activeTab],
              backCallbackSetter: backCallbackSetters[activeTab],
              displayBackButtonSetter: displayBackButtonSetters[activeTab],
              displayNextButtonSetter: displayNextButtonSetters[activeTab],
              importCallbackSetter: importCallbackSetters[activeTab],
              exportCallbackSetter: exportCallbackSetters[activeTab],
              sideEffect: sideEffects[activeTab],
              toNext: toNext, // 用于直接控制是否到下一页
              toPrev: toPrev,  // 用于直接控制是否到上一页
              exitPipelinePrev: exitPipelinePrev,
              formValidations: formValidation,
              validateFormSetter: validateFormSetters[activeTab],
              audit: audit,
              viewDetails: viewDetails,
              recordIdx: recordIdx,
              persistence: cache,
              form: forms[activeTab],
              allForm: forms,
              setPersistence: setCache,
              templateType,
            })}
          </div>
        </div>
        {displayFooters[activeTab] && <div className={styles.bottomContainer}>
          <div className={styles.exitButton}>
            {exitPipelinePrev && <ThemedButton
            style={{height: "45px", width: "120px"}}
              text="Exit"
              inverted
              onClick={() => {
                exitPipelinePrev && exitPipelinePrev();
              }}
            />}
          </div>
          <div className={styles.buttonGroup}>
            {displayBackButtons[activeTab] && <ThemedButton
              text={displayFooterTexts[activeTab][0] || "Back"}
              style={{height: "45px", width: "150px"}}
              inverted
              onClick={async () => {
                if (backCallbacks[activeTab]) {
                  try {
                    await backCallbacks[activeTab]();
                    toPrev();
                  } catch (error) {
                    console.error("Error in backCallback:", error);
                  }
                } else {
                  toPrev();
                  if (activeTab - 1 >= 0) {
                    resetAllowNext(activeTab - 1);
                    resetPipelineState(activeTab - 1);
                    resetNextCallback(activeTab - 1);
                  }
                }
              }} />}
            {displayNextButtons[activeTab] && <ThemedButton
              text={displayFooterTexts[activeTab][1] || "Next"}
              style={{height: "45px", width: "120px"}}
              onClick={async () => {
                if (nextCallbacks[activeTab]) {
                  try {
                    await nextCallbacks[activeTab]();
                    toNext();
                  } catch (error) {
                    console.error("Error in nextCallback:", error);
                  }
                } else {
                  if (allowNexts[activeTab]) {
                    toNext();
                  }
                }

              }} />}
          </div>
        </div>}

      </div>
    </PipelineContext.Provider >
  );
};

export default Pipeline;
export { usePipeline };