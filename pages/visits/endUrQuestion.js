import fetchEndpointWithCorrelationId from "../../src/helpers/fetchEndpointWithCorrelationId";
import React, { useEffect } from "react";
import Layout from "../../src/components/Layout";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import { v4 as uuidv4 } from "uuid";
import Router from "next/router";
import absoluteUrl from "next-absolute-url";

/*
The end UR question is a page that should be navigated to after a call ends but
before the final call end page. The result of this question should be submitted
to the event logging system - this is distinct from console logging and concerns
things to do with the user journey so that journeys can be tracked and we can 
identify potential issues with the service.
*/

export const endUrQuestionConstructor = ({ router }) =>
  function EndUrQuestion({ correlationId, callId, protocol, host }) {
    let selectedFeedback;
    const selectFeedbackOption = (option) => (/*event*/) => {
      selectedFeedback = option;
    };

    const onSubmit = async (event) => {
      event.preventDefault();
      router.push(`/visits/end?callId=${callId}`);

      try {
        await fetchEndpointWithCorrelationId(
          "POST",
          `${protocol}//${host}/api/submit-ur-answer`,
          JSON.stringify({
            "would miss nhs vv": selectedFeedback,
          }),
          correlationId
        );
      } catch {
        console.error("Could not submit UR answer");
      }
    };
    const onClickSkip = async () => {
      router.push(`/visits/end?callId=${callId}`);
    };

    useEffect(() => {
      console.log(correlationId);
    }, []);

    return (
      <Layout title="Submit feedback" isBookService={false}>
        <div className="nhsuk-form-group">
          <form onSubmit={onSubmit} data-testid="ur-question-form">
            <div className="nhsuk-form-group nhsuk-u-margin-bottom-5">
              <fieldset className="nhsuk-fieldset">
                <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--l">
                  <h1 className="nhsuk-fieldset__heading">
                    If this service was no longer available would you be
                    dissappointed/upset?
                  </h1>
                </legend>

                <div
                  data-testid="ur-question-radio-buttons"
                  className="nhsuk-radios"
                >
                  <div className="nhsuk-radios__item">
                    <input
                      className="nhsuk-radios__input"
                      id="ur-question-radio-yes"
                      name="ur-question-radio"
                      type="radio"
                      value="yes"
                      data-testid="ur-question-radio-yes"
                      onClick={selectFeedbackOption("yes")}
                    />
                    <label
                      className="nhsuk-label nhsuk-radios__label"
                      htmlFor="ur-question-radio-yes"
                    >
                      Yes
                    </label>
                  </div>

                  <div className="nhsuk-radios__item">
                    <input
                      className="nhsuk-radios__input"
                      id="ur-question-radio-no"
                      name="ur-question-radio"
                      type="radio"
                      value="no"
                      data-testid="ur-question-radio-no"
                      onClick={selectFeedbackOption("no")}
                    />
                    <label
                      className="nhsuk-label nhsuk-radios__label"
                      htmlFor="ur-question-radio-no"
                    >
                      No
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            <button
              className="nhsuk-button"
              data-testid="submit-ur-question-button"
              type="submit"
            >
              Submit feedback
            </button>
            <button
              className="nhsuk-button nhsuk-button--secondary nhsuk-u-margin-left-5"
              onClick={onClickSkip}
            >
              Skip
            </button>
          </form>
        </div>
      </Layout>
    );
  };

export default endUrQuestionConstructor({ router: Router });

export const getServerSideProps = propsWithContainer(
  async ({ req, res, container, query }) => {
    const { headers } = req;
    const { callId } = query;

    if (process.env.ENABLE_UR_QUESTION === "no") {
      res.writeHead(302, { Location: `/visits/end?callId=${callId}` }).end();
      return {};
    }

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const token = await userIsAuthenticated(headers.cookie);
    const correlationId = `${uuidv4()}-ur-question`;
    const { protocol, host } = absoluteUrl(req, "localhost:3001");

    if (token?.ward || null) {
      res.writeHead(302, { Location: `/visits/end?callId=${callId}` }).end();
      return {};
    } else {
      res.status(200);
      return { props: { correlationId, callId, protocol, host } };
    }
  }
);
