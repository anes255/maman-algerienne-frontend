import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../services/api';

function getVisitorId() {
  var id = localStorage.getItem('_vid');
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('_vid', id);
  }
  return id;
}

function getUtmParams(search) {
  var params = new URLSearchParams(search);
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || ''
  };
}

const PageTracker = () => {
  var location = useLocation();
  var lastTracked = useRef('');

  useEffect(() => {
    var key = location.pathname + location.search;
    if (key === lastTracked.current) return;
    lastTracked.current = key;

    var utm = getUtmParams(location.search);
    trackPageView({
      path: location.pathname,
      referrer: document.referrer || '',
      visitorId: getVisitorId(),
      ...utm
    }).catch(function() {});
  }, [location.pathname, location.search]);

  return null;
};

export default PageTracker;
