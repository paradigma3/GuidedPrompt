const { v4: uuidv4 } = require("uuid");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { chatPrompt, sourceIdentifier } = require("./index");
const { EmbedChats } = require("../../models/embedChats");
const {
  convertToPromptHistory,
  writeResponseChunk,
} = require("../helpers/chat/responses");
const { DocumentManager } = require("../DocumentManager");
const conversationDB1 = {
  "conversation": {
    "1": {
      "id": "1",
      "text": "Learn about our services",
      "context": "Explore detailed information about the wide range of services we offer, specifically designed to empower businesses in the F&B, restaurant, and hotel management industries.",
      "next": {
        "1.1": {
          "id": "1.1",
          "text": "Service Overview",
          "context": "Discover an in-depth overview of our specialized services that cater to the unique needs of F&B establishments, restaurant owners, and hotel management teams.",
          "next": {
            "1.1.1": {
              "id": "1.1.1",
              "text": "More about Service A",
              "context": "Gain detailed insights into Service A, crafted to enhance operational efficiency and guest satisfaction in hotel and restaurant management.",
              "next": {}
            },
            "1.1.2": {
              "id": "1.1.2",
              "text": "More about Service B",
              "context": "Learn more about Service B, which provides innovative solutions for streamlining F&B operations and improving customer experiences.",
              "next": {}
            },
            "1.1.3": {
              "id": "1.1.3",
              "text": "Industry Best Practices",
              "context": "Access expert advice and best practices for optimizing operations in the hospitality and restaurant sectors.",
              "next": {}
            },
            "1.1.4": {
              "id": "1.1.4",
              "text": "Case Studies",
              "context": "Explore success stories from clients in the F&B and hotel management industries who have used our solutions.",
              "next": {}
            }
          }
        },
        "1.2": {
          "id": "1.2",
          "text": "Pricing Information",
          "context": "Access comprehensive details about our pricing models, which are tailored to suit businesses of all sizes in the hospitality and F&B sectors.",
          "next": {
            "1.2.1": {
              "id": "1.2.1",
              "text": "Subscription Plans",
              "context": "Explore our flexible subscription plans designed to provide ongoing support and innovation for F&B and hotel management solutions.",
              "next": {}
            },
            "1.2.2": {
              "id": "1.2.2",
              "text": "One-time Payment Details",
              "context": "Understand the one-time payment options available for our services, ideal for businesses seeking immediate and efficient implementation of solutions.",
              "next": {}
            },
            "1.2.3": {
              "id": "1.2.3",
              "text": "Custom Pricing for Enterprises",
              "context": "Learn about custom pricing models available for large-scale hotel and F&B operations.",
              "next": {}
            },
            "1.2.4": {
              "id": "1.2.4",
              "text": "Free Trial Information",
              "context": "Check out our free trial options to experience the value of our services before committing.",
              "next": {}
            }
          }
        },
        "1.3": {
          "id": "1.3",
          "text": "Specialized Tools & Features",
          "context": "Learn about the advanced tools and features we provide, such as inventory management, reservation systems, and analytics dashboards.",
          "next": {
            "1.3.1": {
              "id": "1.3.1",
              "text": "Reservation Systems",
              "context": "Discover our reservation system tools that help optimize table bookings and guest experiences.",
              "next": {}
            },
            "1.3.2": {
              "id": "1.3.2",
              "text": "Inventory Management",
              "context": "Learn about our inventory management solutions to ensure cost efficiency and reduce waste in F&B operations.",
              "next": {}
            },
            "1.3.3": {
              "id": "1.3.3",
              "text": "Customer Analytics",
              "context": "Gain insights into customer behavior through our advanced analytics tools to drive better decision-making.",
              "next": {}
            },
            "1.3.4": {
              "id": "1.3.4",
              "text": "Integration with POS Systems",
              "context": "Find out how our solutions integrate seamlessly with popular point-of-sale systems.",
              "next": {}
            }
          }
        }
      }
    },
    "2": {
      "id": "2",
      "text": "How to get Started",
      "context": "Find clear and concise guidance on how to begin leveraging our expertise to enhance your F&B or hotel management operations.",
      "next": {
        "2.1": {
          "id": "2.1",
          "text": "Sign-up Process",
          "context": "Learn about the straightforward sign-up process to access our tailored solutions for the F&B and hospitality industries.",
          "next": {}
        },
        "2.2": {
          "id": "2.2",
          "text": "Account Setup",
          "context": "Receive detailed instructions on setting up your account to start benefiting from our cutting-edge services designed for restaurants and hotels.",
          "next": {}
        },
        "2.3": {
          "id": "2.3",
          "text": "Team Onboarding",
          "context": "Understand the onboarding process for your team to maximize the benefits of our solutions.",
          "next": {}
        },
        "2.4": {
          "id": "2.4",
          "text": "Training and Resources",
          "context": "Access training materials and resources to get your staff familiar with our tools and systems.",
          "next": {}
        }
      }
    },
    "3": {
      "id": "3",
      "text": "Contact Support",
      "context": "Discover the multiple ways you can get in touch with our dedicated support team to address any inquiries or technical issues related to your F&B or hotel management solutions.",
      "next": {
        "3.1": {
          "id": "3.1",
          "text": "FAQs",
          "context": "Access frequently asked questions to quickly find answers to common queries about our services and solutions.",
          "next": {}
        },
        "3.2": {
          "id": "3.2",
          "text": "Live Chat",
          "context": "Start a real-time conversation with our support team to receive immediate assistance for your F&B or hotel management-related concerns.",
          "next": {}
        },
        "3.3": {
          "id": "3.3",
          "text": "Email Support",
          "context": "Send your inquiries via email to our support team and get detailed responses tailored to your needs.",
          "next": {}
        },
        "3.4": {
          "id": "3.4",
          "text": "Schedule a Call",
          "context": "Book a call with our experts for a one-on-one discussion about your specific requirements.",
          "next": {}
        }
      }
    }
  }
};
const conversationDB2 = {
  "conversation": {
    "1": {
      "id": "1",
      "text": "Get Started",
      "context": "Learn about our hotel and its amenities, services, and packages.",
      "next": {
        "1.1": {
          "id": "1.1",
          "text": "Welcome to [Hotel Name]",
          "context": "A warm welcome from the team at [Hotel Name]. We’re here to help you plan your stay with us.",
          "next": {}
        },
        "1.2": {
          "id": "1.2",
          "text": "Location",
          "context": "Thank you for your interest in Ramada by Wyndham Manila Central. We are located at Ongpin corner Paredes Streets, Binondo Manila, Philippines. We are right across from the famous Binondo Church. We’ve attached a map here for your reference!",
          "next": {
            "1.2.1": {
              "id": "1.2.1",
              "text": "How to Get Here ",
              "context": "Our address is [insert address], conveniently located near [insert nearby landmarks]. To help you find us easily, discover the best routes from your current location along with nearby landmarks and available transportation options.",
              "Images": {
                "0": {
                  "name": "Hotel Location",
                  "url": "https://du-lich.chudu24.com/f/m/2210/28/khach-san-ramada-by-wyndham-manila-central-0.png",
                  "redirect": "https://www.google.com/maps/dir/?api=1&destination=Ramada+by+Wyndham+Manila+Central"
                }
              },
              "next": {}
            }
          }
        },
        "1.3": {
          "id": "1.3",
          "text": "Room Types",
          "context": "Find out about the different types of rooms we offer, including single, double, and suite options.",
          "next": {
            "1.3.1": {
              "id": "1.3.1",
              "text": "Single Room",
              "context": "Our single room is equipped with a [insert amenities]. Rates start at [insert rate].",
              "next": {}
            },
            "1.3.2": {
              "id": "1.3.2",
              "text": "Double Room",
              "context": "Our double room is equipped with two beds and [insert amenities]. Rates start at [insert rate].",
              "next": {}
            },
            "1.3.3": {
              "id": "1.3.3",
              "text": "Suite",
              "context": "Enjoy the ultimate luxury experience in our suite, equipped with [insert amenities] and a capacity for up to [insert capacity].",
              "next": {}
            }
          }
        },
        "1.4": {
          "id": "1.4",
          "text": "Amenities and Services",
          "context": "Discover the amenities and services we offer, including [insert list of amenities].",
          "next": {
            "1.4.1": {
              "id": "1.4.1",
              "text": "Dining Options",
              "context": "Enjoy a meal at our on-site restaurant or grab something to go from our convenience store.",
              "next": {}
            },
            "1.4.2": {
              "id": "1.4.2",
              "text": "Fitness Center",
              "context": "Get fit with our state-of-the-art fitness center, open 24/7.",
              "next": {}
            }
          }
        },
        "1.5": {
          "id": "1.5",
          "text": "Meeting and Event Spaces",
          "context": "Learn about our meeting and event spaces, including conference rooms, banquet halls, and outdoor venues.",
          "next": {
            "1.5.1": {
              "id": "1.5.1",
              "text": "Conference Rooms",
              "context": "Our conference rooms are equipped with [insert amenities] and can accommodate up to [insert capacity].",
              "next": {}
            },
            "1.5.2": {
              "id": "1.5.2",
              "text": "Banquet Halls",
              "context": "Our banquet halls are perfect for weddings, parties, and other events, with [insert amenities] and a capacity of up to [insert capacity].",
              "next": {}
            }
          }
        },
        "1.6": {
          "id": "1.6",
          "text": "Event Packages",
          "context": "Learn about our event packages and how to book an event with us, including contact information for our Banquet Specialist.",
          "next": {
            "1.6.1": {
              "id": "1.6.1",
              "text": "Event Details",
              "context": "Provide the necessary details for your event, including type, number of guests, date and time, and contact information.",
              "next": {}
            },
            "1.6.2": {
              "id": "1.6.2",
              "text": "Contact Us",
              "context": "Get in touch with our Banquet Specialist to discuss your event needs and preferences.",
              "next": {}
            }
          }
        }
      }
    },
    "2": {
      "id": "1",
      "text": "Test",
      "context": null,
      "next": {}
    }
  }
}
const conversationDB = {
  "conversation": {
    "1": {
      "id": "1",
      "text": "Get Started",
      "context": "Learn about our hotel and its amenities, services, and packages.",
      "widget_type": "img",
      "widgets": {
        "img": {
          "0": {
            "name": "Image Name",
            "url": "",
            "redirect": "redirect link if necessary"
          }
        }
      },
      "next": {
        "1.1": {
          "id": "1.1",
          "text": "Welcome to [Hotel Name]",
          "context": "A warm welcome from the team at [Hotel Name]. We’re here to help you plan your stay with us.",
          "widget_type": "img",
          "widgets": {
            "img": {
              "0": {
                "name": "Image Name",
                "url": "",
                "redirect": "redirect link if necessary"
              }
            }
          },
          "next": {}
        },
        "1.2": {
          "id": "1.2",
          "text": "Location",
          "context": "Thank you for your interest in Ramada by Wyndham Manila Central. We are located at Ongpin corner Paredes Streets, Binondo Manila, Philippines. We are right across from the famous Binondo Church. We’ve attached a map here for your reference!",
          "widget_type": "iframe",
          "widgets": {
            "iframe": {
              "0": {
                "name": "Hotel Location",
                "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d682.5319132757329!2d120.97469933902148!3d14.600012711523165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d4833ee18f8f%3A0x833d1b036c537460!2sRamada%20by%20Wyndham%20Manila%20Central!5e0!3m2!1sen!2sph!4v1738727046289!5m2!1sen!2sph",
                "redirect": "redirect link if necessary"
              }
            }
          },
          "next": {
            "1.2.1": {
              "id": "1.2.1",
              "text": "How to Get Here",
              "context": "Our address is [insert address], conveniently located near [insert nearby landmarks]. To help you find us easily, discover the best routes from your current location along with nearby landmarks and available transportation options.",
              "widget_type": "iframe",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Hotel Location",
                    "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d682.5319132757329!2d120.97469933902148!3d14.600012711523165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d4833ee18f8f%3A0x833d1b036c537460!2sRamada%20by%20Wyndham%20Manila%20Central!5e0!3m2!1sen!2sph!4v1738727046289!5m2!1sen!2sph",
                    "url2": "https://du-lich.chudu24.com/f/m/2210/28/khach-san-ramada-by-wyndham-manila-central-0.png",
                    "redirect": "https://www.google.com/maps/dir/?api=1&destination=Ramada+by+Wyndham+Manila+Central"
                  }
                }
              },
              "next": {}
            }
          }
        },
        "1.3": {
          "id": "1.3",
          "text": "Room Types",
          "context": "Find out about the different types of rooms we offer, including single, double, and suite options.",
          "widget_type": "img",
          "widgets": {
            "img": {
              "0": {
                "name": "Image Name",
                "url": "",
                "redirect": "redirect link if necessary"
              }
            }
          },
          "next": {
            "1.3.1": {
              "id": "1.3.1",
              "text": "Single Room",
              "context": "Our single room is equipped with a [insert amenities]. Rates start at [insert rate].",
              "widget_type": "img",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Image Name",
                    "url": "",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            },
            "1.3.2": {
              "id": "1.3.2",
              "text": "Double Room",
              "context": "Our double room is equipped with two beds and [insert amenities]. Rates start at [insert rate].",
              "widget_type": "img",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Image Name",
                    "url": "",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            },
            "1.3.3": {
              "id": "1.3.3",
              "text": "Suite",
              "context": "Enjoy the ultimate luxury experience in our suite, equipped with [insert amenities] and a capacity for up to [insert capacity].",
              "widget_type": "img",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Image Name",
                    "url": "",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            }
          }
        },
        "1.4": {
          "id": "1.4",
          "text": "Amenities and Services",
          "context": "Discover the amenities and services we offer, including [insert list of amenities].",
          "widget_type": "img",
          "widgets": {
            "img": {
              "0": {
                "name": "Image Name",
                "url": "",
                "redirect": "redirect link if necessary"
              }
            }
          },
          "next": {
            "1.4.1": {
              "id": "1.4.1",
              "text": "Dining Options",
              "context": "Enjoy a meal at our on-site restaurant or grab something to go from our convenience store.",
              "widget_type": "img",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Image Name",
                    "url": "",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            },
            "1.4.2": {
              "id": "1.4.2",
              "text": "Fitness Center",
              "context": "Get fit with our state-of-the-art fitness center, open 24/7.",
              "widget_type": "img",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Image Name",
                    "url": "",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            }
          }
        },
        "1.5": {
          "id": "1.5",
          "text": "Meeting and Event Spaces",
          "context": "Learn about our meeting and event spaces, including conference rooms, banquet halls, and outdoor venues.",
          "widget_type": "img",
          "widgets": {
            "img": {
              "0": {
                "name": "Image Name",
                "url": "",
                "redirect": "redirect link if necessary"
              }
            }
          },
          "next": {
            "1.5.1": {
              "id": "1.5.1",
              "text": "Conference Rooms",
              "context": "Our conference rooms are equipped with [insert amenities] and can accommodate up to [insert capacity].",
              "widget_type": "img",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Image Name",
                    "url": "",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            },
            "1.5.2": {
              "id": "1.5.2",
              "text": "Banquet Halls",
              "context": "Our banquet halls are perfect for weddings, parties, and other events, with [insert amenities] and a capacity of up to [insert capacity].",
              "widget_type": "img",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Image Name",
                    "url": "",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            }
          }
        },
        "1.6": {
          "id": "1.6",
          "text": "Event Packages",
          "context": "Learn about our event packages and how to book an event with us, including contact information for our Banquet Specialist.",
          "widget_type": "img",
          "widgets": {
            "img": {
              "0": {
                "name": "Image Name",
                "url": "",
                "redirect": "redirect link if necessary"
              }
            }
          },
          "next": {
            "1.6.1": {
              "id": "1.6.1",
              "text": "Event Details",
              "context": "Provide the necessary details for your event, including type, number of guests, date and time, and contact information.",
              "widget_type": "img",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Image Name",
                    "url": "",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            },
            "1.6.2": {
              "id": "1.6.2",
              "text": "Contact Us",
              "context": "Get in touch with our Banquet Specialist to discuss your event needs and preferences.",
              "widget_type": "img",
              "widgets": {
                "img": {
                  "0": {
                    "name": "Image Name",
                    "url": "",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            }
          }
        }
      }
    },
    "2": {
      "id": "2",
      "text": "Test",
      "context": null,
      "widget_type": "img",
      "widgets": {
        "img": {
          "0": {
            "name": "Image Name",
            "url": "",
            "redirect": "redirect link if necessary"
          }
        }
      },
      "next": {}
    }
  }
};
function findContextByText(text) {
  function traverse(node) {
    // Check if the current node's text matches the input
    if (node.text === text) {

      return { context: node.context, id: node.id }; // Return both context and id
    }
    // Traverse the 'next' object if it exists
    if (node.next) {
      for (const key in node.next) {
        const result = traverse(node.next[key]);
        if (result) {
          return result;
        }
      }
    }
    return null; // Return null if no match found in this branch
  }

  // Traverse the root level of the conversationDB
  for (const key in conversationDB.conversation) {
    const result = traverse(conversationDB.conversation[key]);
    if (result) {
      return result; // Return the context and id if a match is found
    }
  }
  return null; // Return null if no match found in the entire conversationDB
}
async function streamChatWithForEmbed(
  response,
  /** @type {import("@prisma/client").embed_configs & {workspace?: import("@prisma/client").workspaces}} */
  embed,
  /** @type {String} */
  message,
  /** @type {String} */
  sessionId,
  { promptOverride, modelOverride, temperatureOverride, username ,guided,gid} //added guided
) {
  const chatMode = embed.chat_mode;
  const chatModel = embed.allow_model_override ? modelOverride : null;

  // If there are overrides in request & they are permitted, override the default workspace ref information.
  if (embed.allow_prompt_override)
    embed.workspace.openAiPrompt = promptOverride;
  if (embed.allow_temperature_override)
    embed.workspace.openAiTemp = parseFloat(temperatureOverride);

  const uuid = uuidv4();
  const LLMConnector = getLLMProvider({
    provider: embed?.workspace?.chatProvider,
    model: chatModel ?? embed.workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();

  const messageLimit = 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(embed.workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(embed.workspace.slug);

  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse:
        "I do not have enough information to answer that. Try another question.",
      sources: [],
      close: true,
      error: null,
    });
    return;
  }

  let completeText;
  let metrics = {};
  let contextTexts = [];
  let sources = [];
  let pinnedDocIdentifiers = [];
  const { rawHistory, chatHistory } = await recentEmbedChatHistory(
    sessionId,
    embed,
    messageLimit
  );


//==============================================================
//==============================================================
//=========================== TODO =============================
//==============================================================
//==============================================================
// 1. Modify conversationDB to instead of using const conversationDB = {"conversation": {
// - - Just use conversationDB.embed.id of  the chat. so we can control the source. Ramada,Novel,Mento, etc
// 2. Accordingly update the findContextByTest to include embed.id ex.findContextByText(message,embed.id)
  const contextResult = findContextByText(message);
  const context = contextResult ? contextResult.context : null;
  const contextId = contextResult ? contextResult.id : null;
  // If guided is true, save the message but do not pass it to the LLM
  if (guided) {
    await EmbedChats.new({
      embedId: embed.id,
      prompt: message,
      response: { text: context || "No Context for this guided prompt has been found. Embedding ID: "+embed.uuid, type: "guided", sources: [], metrics: {contextId} },
      connection_information: response.locals.connection
        ? {
            ...response.locals.connection,
            username: !!username ? String(username) : null,
          }
        : { username: !!username ? String(username) : null },
      sessionId,
    });

    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse: context || "No Context for this guided prompt has been found. Embedding ID: "+embed.uuid,
      sources: [],
      close: true,
      error: null,
    });
  } else {


  // See stream.js comment for more information on this implementation.
  await new DocumentManager({
    workspace: embed.workspace,
    maxTokens: LLMConnector.promptWindowLimit(),
  })
    .pinnedDocs()
    .then((pinnedDocs) => {
      pinnedDocs.forEach((doc) => {
        const { pageContent, ...metadata } = doc;
        pinnedDocIdentifiers.push(sourceIdentifier(doc));
        contextTexts.push(doc.pageContent);
        sources.push({
          text:
            pageContent.slice(0, 1_000) +
            "...continued on in source document...",
          ...metadata,
        });
      });
    });

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: embed.workspace.slug,
          input: message,
          LLMConnector,
          similarityThreshold: embed.workspace?.similarityThreshold,
          topN: embed.workspace?.topN,
          filterIdentifiers: pinnedDocIdentifiers,
          rerank: embed.workspace?.vectorSearchMode === "rerank",
        })
      : {
          contextTexts: [],
          sources: [],
          message: null,
        };

  // Failed similarity search if it was run at all and failed.
  if (!!vectorSearchResults.message) {
    writeResponseChunk(response, {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: "Failed to connect to vector database provider.",
    });
    return;
  }

  const { fillSourceWindow } = require("../helpers/chat");
  const filledSources = fillSourceWindow({
    nDocs: embed.workspace?.topN || 4,
    searchResults: vectorSearchResults.sources,
    history: rawHistory,
    filterIdentifiers: pinnedDocIdentifiers,
  });

  // Why does contextTexts get all the info, but sources only get current search?
  // This is to give the ability of the LLM to "comprehend" a contextual response without
  // populating the Citations under a response with documents the user "thinks" are irrelevant
  // due to how we manage backfilling of the context to keep chats with the LLM more correct in responses.
  // If a past citation was used to answer the question - that is visible in the history so it logically makes sense
  // and does not appear to the user that a new response used information that is otherwise irrelevant for a given prompt.
  // TLDR; reduces GitHub issues for "LLM citing document that has no answer in it" while keep answers highly accurate.
  contextTexts = [...contextTexts, ...filledSources.contextTexts];
  sources = [...sources, ...vectorSearchResults.sources];

  // If in query mode and no sources are found in current search or backfilled from history, do not
  // let the LLM try to hallucinate a response or use general knowledge
  if (chatMode === "query" && contextTexts.length === 0) {
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse:
        embed.workspace?.queryRefusalResponse ??
        "There is no relevant information in this workspace to answer your query.",
      sources: [],
      close: true,
      error: null,
    });
    return;
  }

  // Compress message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: chatPrompt(embed.workspace),
      userPrompt: message,
      contextTexts,
      chatHistory,
    },
    rawHistory
  );

  // If streaming is not explicitly enabled for connector
  // we do regular waiting of a response and send a single chunk.
  if (LLMConnector.streamingEnabled() !== true) {
    console.log(
      `\x1b[31m[STREAMING DISABLED]\x1b[0m Streaming is not available for ${LLMConnector.constructor.name}. Will use regular chat method.`
    );
    const { textResponse, metrics: performanceMetrics } =
      await LLMConnector.getChatCompletion(messages, {
        temperature: embed.workspace?.openAiTemp ?? LLMConnector.defaultTemp,
      });
    completeText = textResponse;
    metrics = performanceMetrics;
    writeResponseChunk(response, {
      uuid,
      sources: [],
      type: "textResponseChunk",
      textResponse: completeText,
      close: true,
      error: false,
    });
  } else {
    const stream = await LLMConnector.streamGetChatCompletion(messages, {
      temperature: embed.workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    completeText = await LLMConnector.handleStream(response, stream, {
      uuid,
      sources: [],
    });
    metrics = stream.metrics;
  }

  await EmbedChats.new({
    embedId: embed.id,
    prompt: message,
    response: { text: completeText, type: chatMode, sources, metrics },
    connection_information: response.locals.connection
      ? {
          ...response.locals.connection,
          username: !!username ? String(username) : null,
        }
      : { username: !!username ? String(username) : null },
    sessionId,
  });
  return;
}
}

/**
 * @param {string} sessionId the session id of the user from embed widget
 * @param {Object} embed the embed config object
 * @param {Number} messageLimit the number of messages to return
 * @returns {Promise<{rawHistory: import("@prisma/client").embed_chats[], chatHistory: {role: string, content: string, attachments?: Object[]}[]}>
 */
async function recentEmbedChatHistory(sessionId, embed, messageLimit = 20) {
  const rawHistory = (
    await EmbedChats.forEmbedByUser(embed.id, sessionId, messageLimit, {
      id: "desc",
    })
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

module.exports = {
  streamChatWithForEmbed,
};
