const { v4: uuidv4 } = require("uuid");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { chatPrompt, sourceIdentifier } = require("./index");
const { EmbedChats } = require("../../models/embedChats");
const {
  convertToPromptHistory,
  writeResponseChunk,
} = require("../helpers/chat/responses");
const { DocumentManager } = require("../DocumentManager");

const conversationDB2 = {
  "conversation": {
    "1": {
      "id": "1",
      "text": "Get Started",
      "context": "Learn about our hotel and its amenities, services, and packages",
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
          "widget_type": "img",
          "widgets": {
            "img": {
              "0": {
                "name": "Hotel Location",
                "url": "",
                "url2": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d682.5319132757329!2d120.97469933902148!3d14.600012711523165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d4833ee18f8f%3A0x833d1b036c537460!2sRamada%20by%20Wyndham%20Manila%20Central!5e0!3m2!1sen!2sph!4v1738727046289!5m2!1sen!2sph",
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
                "iframe": {
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
              "text": "Superior Room",
              "context": "Our superior room is equipped with a [insert amenities]. Rates start at [insert rate].",
              "widget_type": "img_multi",
              "widgets": {
                "img_multi": {
                  "0": {
                    "name": "Superior Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSRSlide1.247246da.webp&w=3840&q=75",
                    "redirect": "redirect link if necessary"
                  },
                  "1": {
                    "name": "Deluxe Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FDeluxe2.aa8c793e.webp&w=1920&q=75",
                    "redirect": "redirect link if necessary"
                  },
                  "2": {
                    "name": "Executive Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FExecutive1.69e79d8b.webp&w=3840&q=75",
                    "redirect": "redirect link if necessary"
                  },
                  "3": {
                    "name": "Sleep Suite Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSleep1.559c1013.jpg&w=3840&q=75",
                    "redirect": "redirect link if necessary"
                  },
                  "4": {
                    "name": "Suite Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSuite4.0d9c9bbf.webp&w=3840&q=75",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            },
            "1.3.2": {
              "id": "1.3.2",
              "text": "Deluxe Room",
              "context": "Our deluxe room is equipped with two beds and [insert amenities]. Rates start at [insert rate].",
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
              "text": "Executive Room",
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
            },
            "1.3.4": {
              "id": "1.3.4",
              "text": "Sleep Suite Room",
              "context": "Enjoy the ultimate luxury experience in our Sleep Suite Room, equipped with [insert amenities] and a capacity for up to [insert capacity].",
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
            "1.3.5": {
              "id": "1.3.5",
              "text": "Suite Room",
              "context": "Enjoy the ultimate luxury experience in our Suite Room, equipped with [insert amenities] and a capacity for up to [insert capacity].",
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
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FCondessa1.17e9bf61.jpg&w=3840&q=75",
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
                    "url": "https://www.ramadamanilacentral.com/Function/CalleRosario/RosarioBR1.jpg",
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

const conversationDB = {
  "conversation": {
    "1": {
      "id": "1",
      "text": "Get Started",
      "context": "Learn about our hotel and its amenities, services, and packages",
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
          "text": "Get to Know Us – Welcome!",
          "context": "We’re excited to have you with us. Our hotel is nestled in the heart of Ongpin, Binondo – the world’s oldest Chinatown, rich in history and vibrant culture. Since its beginnings, this area has been a bustling hub of commerce and tradition, attracting travelers from all walks of life. Surrounding our hotel, you’ll discover lively streets filled with authentic Chinese delicacies, historic temples, and unique shops that have stood the test of time. Just a short stroll away, you can explore iconic landmarks like Binondo Church, savor delicious dim sum, or experience the lively atmosphere of the local markets. Whether you’re here to explore the cultural heritage, indulge in culinary adventures, or simply relax, our team is dedicated to making your stay as memorable and comfortable as possible. We’re here to help you make the most of your visit to this vibrant neighborhood!",
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
            "1.1.1": {
              "id": "1.1.1",
              "text": "What's in store at Ongpin, Binondo?",
              "context": "https://www.ramadamanilacentral.com/hotel/wander-and-wonder",
              "widget_type": "img_multi",
              "widgets": {
                "img_multi": {
                  "0": {
                    "name": "Baluarte de San Diego",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbaluarte.a96e72a1.jpg&w=3840&q=75",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/wander-and-wonder/heritage#:~:text=of%20the%20Philippines.-,Baluarte%20de%20San%20Diego,-It%20was%20one"
                  },
                  "1": {
                    "name": "Casa Manila Museum",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FCasa.c5e13f52.webp&w=3840&q=75",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/wander-and-wonder/heritage#:~:text=of%20the%20highlights.-,Casa%20Manila%20Museum,-The%20historical%20home"
                  },
                  "2": {
                    "name": "Cafe Intramuros",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FCafeIntramuros.b8067fa7.webp&w=3840&q=75",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/wander-and-wonder/heritage#:~:text=and%20dance%20performances.-,Cafe%20Intramuros,-A%20new%20dining"
                  },
                  "3": {
                    "name": "Immaculate Conception Parish Church of San Agustin",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2.eb9b6054.webp&w=3840&q=75",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/wander-and-wonder/iglesia#:~:text=Immaculate%20Conception%20Parish%20Church%20of%20San%20Agustin"
                  },
                  "4": {
                    "name": "Minor Basilica of Saint Lorenzo Ruiz",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F9.365efb5a.webp&w=3840&q=75",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/wander-and-wonder/iglesia#:~:text=Minor%20Basilica%20of%20Saint%20Lorenzo%20Ruiz"
                  }
                }
              },
              "next": {}
            }
          }
        },
        "1.2": {
          "id": "1.2",
          "text": "Location",
          "context": "Thank you for your interest in Ramada by Wyndham Manila Central. We are located at Ongpin corner Paredes Streets, Binondo Manila, Philippines. We are right across from the famous Binondo Church. We’ve attached a map here for your reference!",
          "widget_type": "img",
          "widgets": {
            "img": {
              "0": {
                "name": "Hotel Location",
                "url": "",
                "url2": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d682.5319132757329!2d120.97469933902148!3d14.600012711523165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d4833ee18f8f%3A0x833d1b036c537460!2sRamada%20by%20Wyndham%20Manila%20Central!5e0!3m2!1sen!2sph!4v1738727046289!5m2!1sen!2sph",
                "redirect": "redirect link if necessary"
              }
            }
          },
          "next": {
            "1.2.1": {
              "id": "1.2.1",
              "text": "How to Get Here",
              "context": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d682.5319132757329!2d120.97469933902148!3d14.600012711523165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d4833ee18f8f%3A0x833d1b036c537460!2sRamada%20by%20Wyndham%20Manila%20Central!5e0!3m2!1sen!2sph!4v1738727046289!5m2!1sen!2sph",
              "widget_type": "iframe",
              "widgets": {
                "iframe": {
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
          "context": "Explore our selection of rooms, from spacious doubles to luxurious suites, designed to make your stay comfortable and memorable.",
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
              "text": "Superior Room",
              "context": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=STR",
              "widget_type": "img_multi",
              "widgets": {
                "img_multi": {
                  "0": {
                    "name": "Superior Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSRSlide1.247246da.webp&w=3840&q=75",
                    "redirect": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=STR"
                  },
                  "1": {
                    "name": "Deluxe Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FDeluxe2.aa8c793e.webp&w=1920&q=75",
                    "redirect": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=DLX"
                  },
                  "2": {
                    "name": "Executive Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FExecutive1.69e79d8b.webp&w=3840&q=75",
                    "redirect": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=EXE"
                  },
                  "3": {
                    "name": "Sleep Suite Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSleep1.559c1013.jpg&w=3840&q=75",
                    "redirect": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=SUT"
                  },
                  "4": {
                    "name": "Suite Room",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSuite4.0d9c9bbf.webp&w=3840&q=75",
                    "redirect": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=SUT"
                  }
                }
              },
              "next": {}
            },
            "1.3.2": {
              "id": "1.3.2",
              "text": "Deluxe Room",
              "context": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=DLX",
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
              "text": "Executive Room",
              "context": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=EXE",
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
            "1.3.4": {
              "id": "1.3.4",
              "text": "Sleep Suite Room",
              "context": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=SUT",
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
            "1.3.5": {
              "id": "1.3.5",
              "text": "Suite Room",
              "context": "https://ramadamanila.unoreservation.com/reservation?propCode=UI-0039319&roomCode=SUT",
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
          "context": "Ramada by Wyndham Manila Central has 114 modern Asian inspired rooms, multi-function banquet halls, state-of-art fitness center, all-day dining restaurant, cozy lounge, and a complimentary shuttle service. Moreover, you are just a step away from everything great finds in Binondo, the World's Oldest Chinatown!",
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
              "text": "Check our amenities and services",
              "context": "https://www.ramadamanilacentral.com/hotel/amenities",
              "widget_type": "img_multi",
              "widgets": {
                "img_multi": {
                  "0": {
                    "name": "Mento Skyline Restaurant",
                    "url": "https://lirp.cdn-website.com/e14c3e97/dms3rep/multi/opt/Food+Mento-1280w.jpg",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/amenities"
                  },
                  "1": {
                    "name": "Cozy Lobby Lounge",
                    "url": "https://lirp.cdn-website.com/e14c3e97/dms3rep/multi/opt/DSC_0985-2-640w.jpg",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/amenities"
                  },
                  "2": {
                    "name": "Shuttle Service",
                    "url": "https://lirp.cdn-website.com/e14c3e97/dms3rep/multi/opt/Shuttle+Service+B-1280w.jpg",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/amenities"
                  },
                  "3": {
                    "name": "Fitness Center",
                    "url": "https://lirp.cdn-website.com/e14c3e97/dms3rep/multi/opt/DSC_0221-640w.jpg",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/amenities"
                  },
                  "4": {
                    "name": "Business Center",
                    "url": "https://lirp.cdn-website.com/e14c3e97/dms3rep/multi/opt/DSC_0989-640w.jpg",
                    "redirect": "https://www.ramadamanilacentral.com/hotel/amenities"
                  }
                }
              },
              "next": {}
            },
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
              "context": "https://www.ramadamanilacentral.com/ramada-function-halls",
              "widget_type": "img_multi",
              "widgets": {
                "img_multi": {
                  "0": {
                    "name": "Calle Rosario",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FRosario2.c611ec35.jpg&w=3840&q=75",
                    "redirect": "redirect link if necessary"
                  },
                  "1": {
                    "name": "Calle Anloague",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAnloagueC1.faa2c911.jpg&w=3840&q=75",
                    "redirect": "redirect link if necessary"
                  },
                  "2": {
                    "name": "Calle Sacristia",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSacristiaBR1.b41b53a5.jpg&w=3840&q=75",
                    "redirect": "redirect link if necessary"
                  },
                  "3": {
                    "name": "Nueva",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FNuevaBR2.922cdfbb.jpg&w=3840&q=75",
                    "redirect": "redirect link if necessary"
                  },
                  "4": {
                    "name": "Condessa",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FCondessa3.8718a645.jpg&w=3840&q=75",
                    "redirect": "redirect link if necessary"
                  }
                }
              },
              "next": {}
            },
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
              "context": "https://www.ramadamanilacentral.com/Party-and-Meet",
              "widget_type": "img_multi",
              "widgets": {
                "img_multi": {
                  "0": {
                    "name": "Wedding Reception",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FKitani5.45aefa55.webp&w=3840&q=75",
                    "redirect": "https://www.ramadamanilacentral.com/Party-and-Meet/Wedding"
                  },
                  "1": {
                    "name": "Debut Celebration",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAdo2.a05db909.webp&w=1920&q=75",
                    "redirect": "https://www.ramadamanilacentral.com/Party-and-Meet/Debut"
                  },
                  "2": {
                    "name": "Christening Package and Birthday Party",
                    "url": "https://www.ramadamanilacentral.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FYorushika3.4bac5623.webp&w=3840&q=75",
                    "redirect": "https://www.ramadamanilacentral.com/Party-and-Meet/Christening-and-Birthday-Party"
                  },
                  "3": {
                    "name": "All Occasions Package",
                    "url": "https://lirp.cdn-website.com/e14c3e97/dms3rep/multi/opt/For+All+Ages-2880w.jpg",
                    "redirect": "https://www.ramadamanilacentral.com/Party-and-Meet/All-Occasions"
                  },
                }
              },
              "next": {}
            },
          }
        }
      }
    },
    // "2": {
    //   "id": "2",
    //   "text": "Test",
    //   "context": null,
    //   "widget_type": "img",
    //   "widgets": {
    //     "img": {
    //       "0": {
    //         "name": "Image Name",
    //         "url": "",
    //         "redirect": "redirect link if necessary"
    //       }
    //     }
    //   },
    //   "next": {}
    // }
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
